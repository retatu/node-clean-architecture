const MissingParamError = require('./missing-param-error')

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
}
