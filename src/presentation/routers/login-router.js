const HttpRespose = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpResponse) {
    if (!httpResponse || !httpResponse.body || !this.authUseCase || !this.authUseCase.auth) {
      return HttpRespose.serverError()
    }

    const { email, password } = httpResponse.body
    if (!email) {
      return HttpRespose.badRequest('email')
    }
    if (!password) {
      return HttpRespose.badRequest('password')
    }
    this.authUseCase.auth(email, password)

    return HttpRespose.unauthorizedError()
  }
}
