'use strict'

const Router = require('koa-router')
const User = require('../controllers/user')
const App = require('../controllers/app')
const Qiniu = require('../controllers/qiniu')
const Domain = require('../controllers/domain')
const Limiter = require('../middleware/ratelimit')

module.exports = function() {
  var router = new Router({
    prefix: '/api'
  })

  // user
  router.post('/u/signin', Limiter, App.hasBody, User.signin)
  router.post('/u/signup', Limiter, App.hasBody, User.signup)
  router.post('/u/signout', App.hasBody, App.hasToken, User.signout)
  router.post('/u/update', App.hasBody, App.hasToken, User.update)

  // qiniu
  router.post('/qiniu/upload', Qiniu.upload)
  router.post('/qiniu/callback', Qiniu.callback, User.setAvatar)

  //domain
  router.put('/domain', Domain.createDomain)
  router.get('/domain', Domain.queryDomain)

  // DB Interface test
  router.get('/test/user/users', User.users)
  router.post('/test/user/add', User.addUser)
  router.post('/test/user/delete', User.deleteUser)

  return router
}
