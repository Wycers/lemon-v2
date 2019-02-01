'use strict'

var mongoose = require('mongoose')
var Role = mongoose.model('Role')

var guest, admin

exports.initRole = async () => {
  guest = await Role.findOne({
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

  admin = await Role.findOne({
    name: 'admin'
  })
  if (admin === null) {
    try {
      admin = await Role({
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
      console.log('[Init] create role [admin] failed')
    }
  }
  exports.guest = guest
  exports.admin = admin
}
