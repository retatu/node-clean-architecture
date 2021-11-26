// const express = require('express')
// const router = express.Router()

module.exports = () => {
  const router = new SingUpRoute()
  router.post('/singup', ExpressRouteAdapter().adapt(router))
}

class ExpressRouteAdapter {
  static adapt (route) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await route.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// Presentation
// signup-route

class SingUpRoute {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const user = new SingUpUseCase().signUp(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}

// Domain
// signup-usecase

class SingUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository().add(email, password)
    }
  }
}

// Infra
// add-account-repository

const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
