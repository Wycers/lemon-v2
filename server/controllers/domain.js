'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var Domain = mongoose.model('Domain')
var User = mongoose.model('User')
var Role = mongoose.model('Role')
var util = require('../utils/authenticate')

exports.createDomain = async (ctx, next) => {
  const username = ctx.session.username
  const name = ctx.request.body.name
  const radio = ctx.request.body.radio
  const user = await User.findOne({
    username: username
  })
  if (user === null)
  {
    ctx.body = {
      success: false
    } 
    return next
  }
  
  const session = await Domain.startSession()
  session.startTransaction()
  try {
    const opts = { session };
    const domain = await Domain({
      name: name,
      type: radio,
      user: [{ _id: user._id }]
    }).save(opts)
    const role = await Role({
      user: { _id: user._id },
      domain: { _id: domain._id }
    }).save(opts)
    await session.commitTransaction();
    session.endSession();
    ctx.body = {
      success: true
    }
  } catch(error) {
    await session.abortTransaction();
    session.endSession();
    ctx.body = {
      success: false
    }
    console.log(error)
    throw error;
  }
  return next 
}

exports.queryDomain = async (ctx, next) => {
  const username = ctx.session.username
  const user = await User.findOne({
    username: username
  })
  let res = await Domain.find(
    {user: {$elemMatch: { $eq: user._id }}},
    {_id: 1, name: 1}
  )
  ctx.body = res
  console.log(res)
}

exports.getDomain = async (ctx, next) => {
  const _id = ctx.params.id
  const domain = await Domain.findById(_id)
  const userId = ctx.session.userId
  console.log(domain)
  if (domain === null) {
    ctx.body = {
      success: false
    }
    return next
  }
  ctx.body = {
    domain,
    isAdmin: await util.isAdministrator(userId, domain) !== null
  }
  console.log(ctx.body)
}

exports.getUsers = async (ctx, next) => {
  const _id = ctx.params.id
  const domain = await Domain.findById(_id).populate({
    path: 'user', 
    select: ['username', '_id', 'avatar']
  })
  console.log(domain)
  if (domain === null) {
    ctx.body = {
      code: -1
    }
    return next
  }
  ctx.body = {
    code: 0,
    data: domain.user
  }
  return next
}