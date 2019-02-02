'use strict'

var mongoose = require('mongoose')
var Role = mongoose.model('Role')

var guest, admin, partner

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
            quit: false,
            deletable: false
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

  partner = await Role.findOne({
    name: 'partner'
  })
  if (partner === null) {
    try {
      partner = await Role({
        name: 'partner',
        permissions: {
          base: {
            view: true,
            join: false,
            quit: true
          },
          // in user tab
          users: {
            enter: true,
            retrieve: true,
            create: false,
            delete: false
          },
          // in settings tab
          settings: {
            enter: false,
            name: false,
            avatar: false,
            event: false
          }
        },
      }).save()
    } catch (err) {
      console.log(err)
      console.log('[Init] create role [partner] failed')
    }
  }
  exports.guest = guest
  exports.admin = admin
  exports.partner = partner
}
