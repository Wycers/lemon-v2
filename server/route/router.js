'use strict'

const Router = require('koa-router')
const User = require('../controllers/user')
const App = require('../controllers/app')
const Qiniu = require('../controllers/qiniu')
const Domain = require('../controllers/domain')
const Limiter = require('../middleware/ratelimit')
const Folder = require('../controllers/folder')
const Settings = require('../controllers/settings')
const Activity = require('../controllers/activity')

module.exports = () => {
  var router = new Router({
    prefix: '/api'
  })

  // user
  router.post('/u/signin', Limiter, App.hasBody, User.signin)
  router.post('/u/signup', Limiter, App.hasBody, User.signup)
  router.post('/u/signout', App.hasToken, User.signout)
  router.post('/u/update', App.hasBody, App.hasToken, User.update)
  router.post('/user/query', User.queryUser)

  router.post('/user/avatar', App.hasToken, User.MountUser, Qiniu.uploadUserAvatar)
  router.post('/user/:userId/avatar/callback', Qiniu.validate, User.setAvatar)
  // user profile
  router.get('/profile', App.hasToken, User.MountUser, User.getProfile)
  router.post('/profile', App.hasToken, User.MountUser, User.setProfile)

  // qiniu
  router.post('/qiniu/upload', Qiniu.upload)
  router.post('/qiniu/callback', Qiniu.callback)
  router.post('/resource/upload', Qiniu.resourceUpload)
  router.post('/resource/callback', Qiniu.resourceCallback)

  //domain
  router.put('/domain', Domain.createDomain)
  router.get('/domain', Domain.queryDomain)
  router.get('/domain/:id', Domain.getDomain)
  router.get('/domain/:domainId/role', Domain.getRole)
  router.get('/domain/:id/users', Domain.getUsers)
  router.put('/domain/:id/user', Domain.addUser)
  router.delete('/domain/:id/user', Domain.removeUser)
  // router.get('/domain/:domainId/overview', Domain.getOverview)

  router.put('/domain/:domainId/folder', Folder.createFolder)
  router.put('/domain/:domainId/folder/:folderId', Folder.createFolder)
  router.get('/domain/:domainId/folder/:folderId', Folder.listFolder)

  router.get('/domain/:domainId/settings', Settings.getSettings)
  router.post('/domain/:domainId/settings', Settings.setSettings)

  // activity
  router.get('/activity/:activityId', Activity.queryActivity)

  //folder
  router.post('/folder/:folderId/upload', Qiniu.folderUpload)
  router.post('/folder/callback', Qiniu.folderCallback)

  // DB Interface test
  router.get('/test/user/users', User.users)
  router.post('/test/user/add', User.addUser)
  router.post('/test/user/delete', User.deleteUser)

  return router
}
