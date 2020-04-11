// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { buildSchema } from 'graphql'
import graphqlHTTP from 'express-graphql'
// import util from 'util'
// import type { IncomingMessage, ServerResponse } from 'http'
// import url from 'url'

// type ControllerParams = {
//   request: IncomingMessage,
//   response: ServerResponse
// }

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!'
  },
}

export default class GraphQLController {
  public async execute ({ request, response }) {
    request.url = request.url()

    console.log(response.setHeader)

    return await graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    })(request, response)
  }
}
