import { createServer } from '@graphql-yoga/node'
import { schema } from '../../backend/schema';

const server = createServer({
  schema,
  endpoint: '/api/graphql',
  // graphiql: false // uncomment to disable GraphiQL
})

export default server
