class LoginRouter {
  route (httpResponse) {
    if (!httpResponse || !httpResponse.body) {
      return HttpRespose.serverError()
    }

    const { email, password } = httpResponse.body
    if (!email) {
      return HttpRespose.badRequest('email')
    }
    if (!password) {
      return HttpRespose.badRequest('password')
    }
  }
}

class HttpRespose {
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

class MissingParamError extends Error {
  constructor (name) {
    super(`Missing param: ${name}`)
    this.name = 'MissingParamError'
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: '123'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'teste@gmail.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 500 if no http request is provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })
  test('Should return 500 if no http request has no body', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
