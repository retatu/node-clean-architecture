const { MissingParamError } = require('../../utils/errors')
const { InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('repository')
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('repository')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
  }
}
