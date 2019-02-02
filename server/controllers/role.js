'use strict'
var mongoose = require('mongoose')
var Role = mongoose.model('Role')
var Correlation = mongoose.model('Correlation')
var Domain = mongoose.model('Domain')

exports.MountRole = async (ctx, next) => {
  const domainId = ctx.params.domainId
  const userId = ctx.user._id
  let res = await Correlation.findOne({
    user: userId,
    domain: domainId
  }).populate({
    path: 'role',
    select: '-meta -_id'
  })
  if (!res) {
    role = ctx.domain.role.guest
  }
  ctx.role = res.role
  await next()
}