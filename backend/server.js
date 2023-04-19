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
const Course = require('./models/course')

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

const CourseType = new GraphQLObjectType({
  name: 'Course',
  description: 'This represents a course to the app',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    courseCode: { type: GraphQLNonNull(GraphQLString) },
    courseName: { type: GraphQLNonNull(GraphQLString) },
    section: { type: GraphQLNonNull(GraphQLString) },
    semester: { type: GraphQLNonNull(GraphQLString) },
  }),
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    course: {
      type: CourseType,
      description: 'A Single Course',
      args: {
        _id: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        let course
        course = await Course.findById(args._id)
        return course
      },
    },
    courses: {
      type: new GraphQLList(CourseType),
      description: 'List of All Courses',
      resolve: async () => {
        console.log('siuuu')
        const courses = await Course.find()
        return courses
      },
    },
  }),
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addCourse: {
      type: CourseType,
      description: 'Add a Course',
      args: {
        courseCode: { type: GraphQLNonNull(GraphQLString) },
        courseName: { type: GraphQLNonNull(GraphQLString) },
        section: { type: GraphQLNonNull(GraphQLString) },
        semester: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const course = new Course({
          courseCode: args.courseCode,
          courseName: args.courseName,
          section: args.section,
          semester: args.semester,
        })

        const newCourse = await course.save()

        console.log('adding a course')

        return newCourse
      },
    },
    editCourse: {
      type: CourseType,
      description: 'Edit a Course',
      args: {
        _id: { type: GraphQLNonNull(GraphQLString) },
        courseCode: { type: GraphQLNonNull(GraphQLString) },
        courseName: { type: GraphQLNonNull(GraphQLString) },
        section: { type: GraphQLNonNull(GraphQLString) },
        semester: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const updatedCourse = await Course.findByIdAndUpdate(
          args._id,
          {
            $set: {
              courseCode: args.courseCode,
              courseName: args.courseName,
              section: args.section,
              semester: args.semester,
            },
          },
          { new: true },
        )
        return updatedCourse
      },
    },
    deleteCourse: {
      type: CourseType,
      description: 'Delete a Course',
      args: {
        _id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const deletedCourse = await Course.findByIdAndDelete(args._id)
        return deletedCourse
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
  '/courses',
  expressGraphQL({
    schema: schema,
    graphiql: true,
  }),
)

prepareTrainingModel()

app.listen(5000, () => console.log('Server Started'))
