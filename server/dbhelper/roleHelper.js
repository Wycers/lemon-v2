'use strict'

var mongoose = require('mongoose')
var Role = mongoose.model('Role')

exports.initRole = async () => {
  var guest = await Role.findOne({
    name: 'guest'
  })
  if (guest === null) {
    try {
      await Role({
        name: 'guest'
      }).save()
    } catch (err) {
      console.log(err)
      console.log('[Init] create role [guest] failed')
    }
  }

  var admin = await Role.findOne({
    name: 'admin'
  })
  if (admin === null) {
    try {
      await Role({
        name: 'admin',
        permissions: {
          base: {
            quit: false
          },
          // in user tab
          users: {
            enter: true,
            retrieve: true,
            create: true,
            delete: true
          },
          // in settings tab
          settings: {
            enter: true,
            name: {
              update: true
            },
            avatar: {
              update: true
            },
            event: true
          }
        },
      }).save()
    } catch (err) {
      console.log(err)
      console.log('[Init] create role [guest] failed')
    }
  }
}
