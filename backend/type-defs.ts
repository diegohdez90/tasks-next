import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Query {
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
  type Mutation {
    createTask(input: TaskInput!): Task
    updateTask(input: TaskInputUpdated!): Task
    deleteTask(id: Int!): Task
  }
`