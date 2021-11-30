const HttpRespose = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpResponse) {
    try {
      const { email, password } = httpResponse.body
      if (!email) {
        return HttpRespose.badRequest(new MissingParamError('email'))
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
      return HttpRespose.serverError()
    }
  }
}
