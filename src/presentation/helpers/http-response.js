const MissingParamError = require('./missing-param-error')
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
      statusCode: 500
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static ok () {
    return {
      statusCode: 200
    }
  }
}
