'use strict'

var mongoose = require('mongoose')
var Folder = mongoose.model('Folder')

exports.createFolder = async (ctx, next) => {
  console.log(ctx.request.body)
}