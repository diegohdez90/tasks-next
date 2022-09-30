import { Resolvers, TaskStatus } from "../generated/graphql-backend";
import ServerlessMysql from 'serverless-mysql';
import { OkPacket} from 'mysql';
import { GraphQLError } from "graphql";

interface Context {
  db: ServerlessMysql.ServerlessMysql
}

interface TaskDbRow {
  id: number;
  title: string;
  task_status: TaskStatus
}

export type TasksDbQueryResult = TaskDbRow[];

type TaskDbQueryResult = TaskDbRow[];

const getTaskById = async (id: number, db: ServerlessMysql.ServerlessMysql) => {
  const tasks = await db.query<TaskDbQueryResult>('SELECT * FROM tasks WHERE id=?', [id]);
    return tasks.length ? {
      id: tasks[0].id,
      title: tasks[0].title,
      status: tasks[0].task_status
    } : null;
}

export const resolvers: Resolvers<Context>= {
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
    },
    Mutation: {
      async createTask(parent, args, context) {
        const { input } = args;
        const result = await context.db.query<OkPacket>('INSERT INTO tasks (title, task_status) VALUES (?, ?)', [
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
      async deleteTask(parent, args, context) {
        const task = await getTaskById(args.id, context.db);
        if (!task) {
          throw new GraphQLError('Could not find your data');
        }
        await context.db.query('DELETE FROM tasks WHERE id = ?', [args.id]);
        return task;
      }
    }
  }
  