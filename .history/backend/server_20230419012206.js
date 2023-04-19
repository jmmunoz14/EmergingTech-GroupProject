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

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a user to the app',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLNonNull(GraphQLString) },
    city: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLNonNull(GraphQLString) },
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
        address: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
        usertype: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const user = new User({
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
          address: args.address,
          city: args.city,
          phone: args.phone,
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
        address: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
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
              address: args.address,
              city: args.city,
              phone: args.phone,
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

app.listen(5000, () => console.log('GraphQL: Server Started'))
