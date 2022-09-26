import { Resolvers, TaskStatus } from "../generated/graphql-backend";
import { Context, getTaskById, TasksDbQueryResult } from "../pages/api/graphql";
import { OkPacket} from 'mysql';
import { GraphQLYogaError } from "@graphql-yoga/node";
import { GraphQLError } from "graphql";

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
  