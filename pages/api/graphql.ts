import { createServer } from '@graphql-yoga/node';

const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
    tasks(status: TaskStatus): [Task!]!
    task(id: Int!): Task!
  }
  enum TaskStatus  {
    active
    completed
  }
  input TaskInput {
    title: String!
  }
  input TaskInputUpdated {
    id: Int!
    title: String
    status: TaskStatus
  }
  type Task {
    id: Int!
    title: String!
    status: TaskStatus!
  }
  type User {
    name: String
  }
  type Mutation {
    createTask(input: TaskInput!): Task
    updateTask(input: TaskInputUpdated!): Task
    deleteTask(id: Int!): Task
  }
`

const resolvers = {
  Query: {
    tasks() {
      return [];
    },
    task() {
      return null
    },
    users() {
      return [{ name: 'Nextjs' }]
    },
  },
  Mutation: {
    createTask() {
      return null;
    },
    updateTask() {
      return null;
    },
    deleteTask() {
      return null;
    }
  }
}

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: '/api/graphql',
  // graphiql: false // uncomment to disable GraphiQL
})

export default server;
