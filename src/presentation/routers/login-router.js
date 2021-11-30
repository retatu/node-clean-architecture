const HttpRespose = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpResponse) {
    try {
      const { email, password } = httpResponse.body
      if (!email) {
        return HttpRespose.badRequest('email')
      }
      if (!password) {
        return HttpRespose.badRequest('password')
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpRespose.unauthorizedError()
      }
      return HttpRespose.ok({ accessToken })
    } catch (ex) {
      return HttpRespose.serverError()
    }
  }
}
