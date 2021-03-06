const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const { ServerError, UnauthorizedError } = require('../errors')
const LoginRouter = require('./login-router')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidator = makeEmailValidator()
  const sut = new LoginRouter(authUseCaseSpy, emailValidator)
  return { authUseCaseSpy, sut, emailValidator }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidator = new EmailValidatorSpy()
  emailValidator.isEmailValid = true
  return emailValidator
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid (email) {
      throw Error()
    }
  }
  return new EmailValidatorSpy()
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  const authCase = new AuthUseCaseSpy()
  authCase.accessToken = 'valid_token'
  return authCase
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw Error()
    }
  }
  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: '123'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'teste@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 500 if no http request is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if no http request has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call AuthUseCase with correct params', async () => {
    const { authUseCaseSpy, sut } = makeSut()
    const httpRequest = {
      body: {
        password: '123',
        email: 'teste@gmail.com'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })
  test('Should return 500 if no AuthCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any',
        email: 'any@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if no AuthCase has no method auth', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        password: 'any',
        email: 'any@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 200 if valid credentials are provided', async () => {
    const { authUseCaseSpy, sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'valid_password',
        email: 'valid_email@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })
  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        password: 'invalid_password',
        email: 'invalid_email@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
  test('Should return 500 if AuthCase throws', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        password: 'any',
        email: 'any@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 400 if invalid email is provided', async () => {
    const { sut, authUseCaseSpy, emailValidator } = makeSut()
    emailValidator.isEmailValid = false
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        password: 'any',
        email: 'invalid_email@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('Should return 500 if no EmailValidator is provided', async () => {
    const sut = new LoginRouter(makeAuthUseCase())
    const httpRequest = {
      body: {
        password: 'any',
        email: 'any@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if no EmailValidator has no isValid method', async () => {
    const sut = new LoginRouter(makeAuthUseCase(), {})
    const httpRequest = {
      body: {
        password: 'any',
        email: 'any@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if AuthCase throws', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidator = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCaseSpy, emailValidator)
    const httpRequest = {
      body: {
        password: 'any',
        email: 'any@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call EmailValidator with correct email', async () => {
    const { emailValidator, sut } = makeSut()
    const httpRequest = {
      body: {
        password: '123',
        email: 'teste@gmail.com'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidator.email).toBe(httpRequest.body.email)
  })
})
