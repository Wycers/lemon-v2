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
  const token = ctx.request.headers.authorization || null

  if (!token || !ctx.session || token !== ctx.session.token) {
    ctx.body = {
      code: -1,
      err: 'invalid token'
    }
    return
  }
  await next()
}
