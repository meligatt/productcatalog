// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GraphQLController {
  public async execute () {
    return { hello: 'world' }
  }
}
