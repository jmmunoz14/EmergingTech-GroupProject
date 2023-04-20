require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
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

// Import TensorFlow.js and the required packages
const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const symptoms = [
  'headache',
  'fever',
  'stomachache',
  'muscle pain',
  'dizziness',
]
const labels = ['rest', 'doctor']

async function trainModel() {
  // Define a sequential model
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 16, inputShape: [5], activation: 'relu' }))
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 2, activation: 'softmax' }))

  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  // Prepare the training data
  const trainingData = tf.tensor2d([
    [1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 0, 1],
  ])
  const trainingLabels = tf.tensor2d([
    [1, 0],
    [0, 1],
    [1, 0],
    [0, 1],
    [0, 1],
    [1, 0],
    [0, 1],
    [0, 1],
  ])

  // Train the model
  await model.fit(trainingData, trainingLabels, {
    epochs: 50,
    callbacks: tf.callbacks.earlyStopping({ monitor: 'loss', patience: 5 }),
  })

  // Evaluate the model on a test example
  const input = tf.tensor2d([[0, 1, 1, 0, 0]]) // no headache, fever, stomachache, no muscle pain, no dizziness
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
    loginmute: {
      type: UserType,
      description: 'Login',
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        usertype: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const user = new User({
          email: args.email,
          usertype: args.usertype,
          password: args.password,
        })
        const loginUser = await user.save()
        console.log('user trying to log in...')

        return loginUser
      },
    },
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
        console.log('adding a user')

        return newUser
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
