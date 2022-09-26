import { createServer } from '@graphql-yoga/node';
import ServerlessMysql from 'serverless-mysql';
import { OkPacket } from 'mysql';
import { Resolvers, TaskStatus } from '../../generated/graphql-backend';

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

interface TaskDbRow {
  id: number;
  title: string;
  task_status: TaskStatus
}

type TasksDbQueryResult = TaskDbRow[];

type TaskDbQueryResult = TaskDbRow[];

const getTaskById = async (id: number, db: ServerlessMysql.ServerlessMysql) => {
  const tasks = await db.query<TaskDbQueryResult>('SELECT * FROM tasks WHERE id=?', [id]);
    return tasks.length ? {
      id: tasks[0].id,
      title: tasks[0].title,
      status: tasks[0].task_status
    } : null;
}

const resolvers: Resolvers<Context>= {
  Query: {
    async tasks(parent, args, context) {
      let query = 'SELECT * FROM tasks';
      const queryParams = [];
      const { status } = args;
      if (status) {
        query +=  ' WHERE task_status=?';
        queryParams.push(status);
      }
      const result = await context.db.query<TasksDbQueryResult>(
        query, queryParams
      );
      console.log(result);
      await context.db.end();
      return result.map(({id, title, task_status}) => ({
        id,
        title,
        status: task_status
      }));
    },
    async task(parent, args, context) {
      return await getTaskById(args.id, context.db)
    },
    users() {
      return [{ name: 'Nextjs' }]
    },
  },
  Mutation: {
    async createTask(parent, args, context) {
      const { input } = args;
      const result = await context.db.query<OkPacket>('INSERT INTO  tasks (title, task_status) VALUES (?, ?)', [
        input.title,
        TaskStatus.Active
      ]);
      return {
        id: result.insertId,
        title: args.input.title,
        status: TaskStatus.Active
      };
    },
    async updateTask(parent, args, context) {
      const columns: string[] = [];
      const sqlParams: string[] = [];

      if (args.input.title) {
        columns.push('title = ?');
        sqlParams.push(args.input.title);
      }

      if (args.input.status) {
        columns.push('task_status = ?');
        sqlParams.push(args.input.status);
      }

      await context.db.query(`UPDATE tasks SET ${columns.join(',')} WHERE id = ?`, [
        ...sqlParams,
        args.input.id
      ]);

      const task = await getTaskById(args.input.id, context.db);

      return task;
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
