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
const Role = require('../controllers/role')

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
  router.post('/resource/upload', Qiniu.resourceUpload)
  router.post('/resource/callback', Qiniu.resourceCallback)

  //domain
  router.put('/domain', App.hasToken, User.MountUser, Domain.createDomain)
  router.get('/domain', App.hasToken, User.MountUser, Domain.queryDomain)
  router.post('/domain/search', Domain.searchDomain)
  router.post('/domain/:domainId/join', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Domain.joinDomain)
  router.post('/domain/:domainId/quit', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Domain.quitDomain)
  router.get('/domain/:domainId', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Domain.getDomain)
  router.get('/domain/:domainId/users', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Domain.getUsers)
  router.put('/domain/:domainId/user', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Domain.addUser)
  router.delete('/domain/:domainId/user', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Domain.removeUser)

  router.post('/domain/:domainId/avatar', App.hasToken, User.MountUser, Role.MountRole, Qiniu.uploadDomainAvatar)
  router.post('/domain/:domainId/avatar/callback', Qiniu.validate, Domain.setAvatar)

  router.put('/domain/:domainId/folder', Folder.createFolder)
  router.put('/domain/:domainId/folder/:folderId', Folder.createFolder)
  router.get('/domain/:domainId/folder/:folderId', Folder.listFolder)

  router.get('/domain/:domainId/settings', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Settings.getSettings)
  router.post('/domain/:domainId/settings', App.hasToken, User.MountUser, Domain.MountDomain, Role.MountRole, Settings.setSettings)

  // activity
  router.get('/activity/:activityId', Activity.queryActivity)

  //folder
  router.post('/folder/:folderId/upload', Qiniu.folderUpload)
  router.post('/folder/callback', Qiniu.folderCallback)

  return router
}
