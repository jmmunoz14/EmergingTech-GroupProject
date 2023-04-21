require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql')
const User = require('./models/user')

const fs = require('fs')
const Papa = require('papaparse')

const csv = require('csv-parser')

// Import TensorFlow.js and the required packages
const tf = require('@tensorflow/tfjs')
const { debug } = require('console')
require('@tensorflow/tfjs-node')

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const labels = ['rest', 'doctor']

async function trainModel() {
  // Define a sequential model
  const model = tf.sequential()
  model.add(
    tf.layers.dense({ units: 16, inputShape: [17], activation: 'relu' }),
  )
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 2, activation: 'softmax' }))

  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  // Read the CSV file
  const csvFile = fs.readFileSync('sympts.csv', 'utf8')
  const parsedData = Papa.parse(csvFile, { header: true })

  // Extract the symptoms and labels from the parsed CSV data
  const symptoms = Object.keys(parsedData.data[0]).slice(0, 17)
  console.log(symptoms)
  const stayHomeIndex = symptoms.length
  console.log(stayHomeIndex)

  const goToDoctorIndex = stayHomeIndex + 1
  console.log(goToDoctorIndex)

  const trainingData = parsedData.data.map((row) =>
    Object.values(row)
      .slice(0, stayHomeIndex)
      .map((val) => parseInt(val)),
  )
  const trainingLabels = parsedData.data.map((row) => {
    const stayHomeLabel = parseInt(row.home)
    const goToDoctorLabel = parseInt(row.medic)
    return [stayHomeLabel, goToDoctorLabel]
  })

  // Train the model
  trainingData.pop()
  trainingLabels.pop()

  console.log(trainingData.length)
  const tensorTrainingData = tf.tensor2d(trainingData)
  const tensorTrainingLabels = tf.tensor2d(trainingLabels)

  await model.fit(tensorTrainingData, tensorTrainingLabels, {
    epochs: 50,
    callbacks: tf.callbacks.earlyStopping({ monitor: 'loss', patience: 5 }),
  })

  // Evaluate the model on a test example
  const input = tf.tensor2d([
    [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ])
  const prediction = model.predict(input)
  console.log(`Prediction: ${prediction.dataSync()[0]}`) // 1 = go to doctor, 0 = rest at home

  return model
}

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a user to the app',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    usertype: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  }),
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    user: {
      type: UserType,
      description: 'A Single User',
      args: {
        _id: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        let user
        user = await User.findById(args._id)
        return user
      },
    },
    users: {
      type: new GraphQLList(UserType),
      description: 'List of All Users',
      resolve: async () => {
        console.log('siuuu')
        const users = await User.find()
        return users
      },
    },
  }),
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      description: 'Add a User',
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        usertype: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const user = new User({
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
          usertype: args.usertype,
          password: args.password,
        })
        const newUser = await user.save()
        const token = jwt.sign(
          { _id: newUser._id, email: newUser.email },
          private_key,
          { algorithm: 'RS256' },
        )
        console.log('adding a user')

        return newUser
      },
    },
    loginUser: {
      type: UserType,
      description: 'Login',
      args: {
        password: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { email, password }) => {
        const user = await User.findOne({ email })

        if (!user) {
          throw new Error('User not found')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          throw new Error('Incorrect password')
        }
        //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const usertype = user.usertype
        console.log(email + ' (' + usertype + ') logging in...')

        return { email, usertype }
      },
    },
    editUser: {
      type: UserType,
      description: 'Edit a User',
      args: {
        _id: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        usertype: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const updatedUser = await User.findByIdAndUpdate(
          args._id,
          {
            $set: {
              email: args.email,
              firstName: args.firstName,
              lastName: args.lastName,
              usertype: args.usertype,
              password: args.password,
            },
          },
          { new: true },
        )
        return updatedUser
      },
    },
    deleteUser: {
      type: UserType,
      description: 'Delete a User',
      args: {
        _id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const deletedUser = await User.findByIdAndDelete(args._id)
        return deletedUser
      },
    },
  }),
})

async function prepareTrainingModel() {
  const model = await trainModel()
  console.log('Model trained successfully!')

  app.post('/predict', (req, res) => {
    const data = req.body.data
    const input = tf.tensor2d([data])
    const prediction = model.predict(input)
    const predictionData = prediction.dataSync()
    const result = {
      rest: predictionData[0],
      doctor: predictionData[1],
    }
    res.send(result)
  })
}

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
})

app.use(cors())

app.use(express.json())
app.use(
  '/users',
  expressGraphQL({
    schema: schema,
    graphiql: true,
  }),
)

prepareTrainingModel()

app.listen(5000, () => console.log('GraphQL: Server Started'))
