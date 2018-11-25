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
    id: uuid(),
    name: name,
    type: radio,
    users: [
      {
        user: user,
        role: 0
      }
    ]
  })
  try {
    domain = await domain.save()
    user.domains.$push({domain})
    user = await user.save()
    User.update({ '_id': user._id }, {
      $push: {
        domains: {domain}
      },
      callback: (err) => {
        console.log(err)
      }
    })
    ctx.body = {
      success: true
    }
  } catch (e) {
    console.log(e)
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
    {users: {$elemMatch: {user: user._id}}},
    {_id: 0, name: 1, id: 1}
  )
  ctx.body = res
  console.log(res)
}