import { createServer } from '@graphql-yoga/node';
import { IResolvers } from '@graphql-tools/utils';
import ServerlessMysql from 'serverless-mysql';

const db = ServerlessMysql({
  config: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  }
});


const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
    tasks(status: TaskStatus): [Task!]!
    task(id: Int!): Task
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

interface Context {
  db: ServerlessMysql.ServerlessMysql
}

const resolvers: IResolvers<any, Context>= {
  Query: {
    async tasks(parent, args, context) {
      console.log(db.getConfig());
      
      console.log('getting client', context.db.getClient());
      const result = await context.db.query(
        'SELECT "HELLO WORLD" AS hello_world'
      )
      console.log(result);
      await context.db.end();
      return [];
    },
    task(parent, args, context) {
      return null
    },
    users() {
      return [{ name: 'Nextjs' }]
    },
  },
  Mutation: {
    createTask(parent, args, context) {
      return null;
    },
    updateTask(parent, args, context) {
      return null;
    },
    deleteTask(parent, args, context) {
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
  context: {
    db: db
  }
  // graphiql: false // uncomment to disable GraphiQL
})

export default server;
