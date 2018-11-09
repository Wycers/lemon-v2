'use strict'

// 用于封装controllers的公共方法

var mongoose = require('mongoose')
var uuid = require('uuid')
var User = mongoose.model('User')

exports.hasBody = async (ctx, next) => {
  var body = ctx.request.body || {}
  // console.log(this.query.phonenumber)
  // console.log(body)

  if (Object.keys(body).length === 0) {
    ctx.body = {
      success: false,
      err: '某参数缺失'
    }

    return next
  }

  await next()
}

// 检验token
exports.hasToken = async (ctx, next) => {
  var token = ctx.query.token

  if (!token) {
    token = ctx.request.body.token
  }

  if (!token) {
    ctx.body = {
      success: false,
      err: '令牌失效'
    }

    return next
  }

  var user = await User.findOne({
    token: token
  }).exec()

  if (!user) {
    ctx.body = {
      success: false,
      err: '用户没登陆'
    }

    return next
  }

  ctx.session = ctx.session || {}
  ctx.session.user = user

  await next()
}
