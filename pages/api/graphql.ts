import { createServer, GraphQLYogaError } from '@graphql-yoga/node';
import ServerlessMysql from 'serverless-mysql';
import { TaskStatus } from '../../generated/graphql-backend';
import { schema } from  '../../backend/schema';
import { db } from '../../backend/db';

export interface Context {
  db: ServerlessMysql.ServerlessMysql
}

interface TaskDbRow {
  id: number;
  title: string;
  task_status: TaskStatus
}

export type TasksDbQueryResult = TaskDbRow[];

type TaskDbQueryResult = TaskDbRow[];

export const getTaskById = async (id: number, db: ServerlessMysql.ServerlessMysql) => {
  const tasks = await db.query<TaskDbQueryResult>('SELECT * FROM tasks WHERE id=?', [id]);
    return tasks.length ? {
      id: tasks[0].id,
      title: tasks[0].title,
      status: tasks[0].task_status
    } : null;
}

const server = createServer({
  schema,
  endpoint: '/api/graphql',
  context: {
    db: db
  }})

export default server;
