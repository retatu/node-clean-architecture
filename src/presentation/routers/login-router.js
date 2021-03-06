const HttpRespose = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpResponse) {
    try {
      const { email, password } = httpResponse.body
      if (!email) {
        return HttpRespose.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpRespose.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpRespose.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpRespose.unauthorizedError()
      }
      return HttpRespose.ok({ accessToken })
    } catch (ex) {
      console.error(ex)
      return HttpRespose.serverError()
    }
  }
}
