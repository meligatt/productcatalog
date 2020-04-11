// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { buildSchema } from 'graphql'
// import graphqlHTTP from 'express-graphql'
// import type { IncomingMessage } from 'http'

// // Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `)

// // The root provides a resolver function for each API endpoint
// const root = {
//   hello: () => {
//     return 'Hello world!'
//   },
// }

// export default class GraphQL {
//   public async handle ({request, response}: HttpContextContract, next: () => Promise<void>) {
//     graphqlHTTP(async (request, response, graphQLParams) => ({
//       schema: schema,
//       rootValue: root,
//       graphiql: false,
//     }))(request, response),
//     await next()
//   }
// }
