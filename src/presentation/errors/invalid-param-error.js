module.exports = class InvalidParamError extends Error {
  constructor (name) {
    super(`Invalid param: ${name}`)
    this.name = 'InvalidParamError'
  }
}
