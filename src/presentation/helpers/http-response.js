const MissingParamError = require('./missing-param-error')
const ServerError = require('./server-error')
const UnauthorizedError = require('./unauthorized-error')

module.exports = class HttpRespose {
  static badRequest (name) {
    return {
      statusCode: 400,
      body: new MissingParamError(name)
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }
}
