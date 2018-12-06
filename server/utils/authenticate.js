'use strict'

var mongoose = require('mongoose')
var Role = mongoose.model('Role')
exports.isAdministrator = async (userId, domain) => {
  do {
    const role = await Role.findOne({
      user: userId,
      domain: domain._id
    })
    if (role === null)
      domain = domain.father
    else
      return role
  } while (domain !== null)
  return null
}