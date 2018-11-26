'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var Domain = mongoose.model('Domain')
var User = mongoose.model('User')

exports.createDomain = async (ctx, next) => {
  const username = ctx.session.username
  const name = ctx.request.body.name
  const radio = ctx.request.body.radio
  let user = await User.findOne({
    username: username
  })
  if (user === null)
  {
    ctx.body = {
      success: false
    } 
    return next
  }
  let domain = new Domain({
    name: name,
    type: radio,
    users: [
      {
        user
      }
    ]
  })
  try {
    domain = await domain.save()
    user = await user.save()
    ctx.body = {
      success: true
    }
  } catch (e) {
    ctx.body = {
      success: false  
    }
  }
  ctx.body = {
    success: true
  }
  return next 
}

exports.queryDomain = async (ctx, next) => {
  const username = ctx.session.username
  const user = await User.findOne({
    username: username
  })
  let res = await Domain.find(
    {users: {$elemMatch: { $eq: user._id}}},
    {_id: 1, name: 1}
  )
  ctx.body = res
  console.log(res)
}

exports.getDomain = async (ctx, next) => {
  const _id = ctx.params.id
  const domain = await Domain.findOne({
    _id: _id
  }, {
    name: 1,
    type: 1,
    users: 1
  }).populate({
    path: 'users',
    select: ['username', '_id', 'avatar']
  })
  console.log(domain)
  if (domain === null) {
    ctx.body = {
      success: false
    }
    return next
  }
  ctx.body = domain
}