'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var Domain = mongoose.model('Domain')

exports.createDomain = async (ctx, next) => {
  const name = ctx.request.body.name
  const radio = ctx.request.body.radio
  console.log(name, radio)
  let domain = new Domain({
    name: name,
    type: radio
  })
  try {
    domain = await domain.save()
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
