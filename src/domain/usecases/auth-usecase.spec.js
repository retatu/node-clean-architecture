const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  class EncryptSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return null
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepository.user = {
    password: 'hashed_password'
  }
  const encryptSpy = new EncryptSpy()
  const sut = new AuthUseCase(loadUserByEmailRepository, encryptSpy)
  return {
    sut,
    loadUserByEmailRepository,
    encryptSpy
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    await sut.auth('any_email@email.com', 'any_passowrd')
    expect(loadUserByEmailRepository.email).toBe('any_email@email.com')
  })
  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com', 'any_passowrd')
    expect(promise).rejects.toThrow()
  })
  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@email.com', 'any_passowrd')
    expect(promise).rejects.toThrow()
  })
  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository.user = null
    const accessToken = await sut.auth('invalid_email@email.com', 'any_passowrd')
    expect(accessToken).toBe(null)
  })
  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('any@email.com', 'invalid_passowrd')
    expect(accessToken).toBe(null)
  })
  test('Should call Encrypt with correct values', async () => {
    const { sut, loadUserByEmailRepository, encryptSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'any_password')
    expect(encryptSpy.password).toBe('any_password')
    expect(encryptSpy.hashedPassword).toBe(loadUserByEmailRepository.user.password)
  })
})
