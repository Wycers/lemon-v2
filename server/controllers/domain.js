'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var Domain = mongoose.model('Domain')
var User = mongoose.model('User')
var Correlation = mongoose.model('Correlation')
var Activity = mongoose.model('Activity')
var { pick } = require('../utils/select')

exports.MountDomain = async (ctx, next) => {
  const domainId = ctx.params.domainId || null
  if (domainId) {
    const res = await Domain.findById(domainId)
    if (res) {
      ctx.domain = res
      await next()
    } else {
      ctx.throw(404)
    }
  } else {
    ctx.throw(401)
  }
}

exports.createDomain = async (ctx, next) => {
  const name = ctx.request.body.name
  
  const radio = ctx.request.body.radio
  if (radio < 0 || radio > 3)
  {
    ctx.body = {
      success: false
    }
    return next
  }

  const user = ctx.user
  
  const session = await Domain.startSession()
  session.startTransaction()
  try {
    const opts = { session };

    let eventType = null
    let event = null
    if (radio === 0) {
      throw Error('qwq')
    }
    else if (radio === 1) {
      throw Error('qwq')
    }
    else if (radio === 2) {
      throw Error('qwq')
    }
    else {
      eventType = 'activity'
      event = await Activity().save(opts)
    }

    const { guest, admin, partner } = require('../dbhelper/roleHelper')
    const domain = await Domain({
      name: name,
      eventType: eventType,
      eventId: event._id,
      role: {
        guest: guest,
        admin: admin,
        default: partner,
        others: []
      }
    }).save(opts)

    const correlation = await Correlation({
      user: user,
      domain: domain,
      role: admin
    }).save(opts)

    await session.commitTransaction();
    ctx.body = {
      success: true
    }
  } catch(error) {
    await session.abortTransaction();
    ctx.body = {
      success: false
    }
  } finally {
    session.endSession();
  }
  return next 
}

exports.queryDomain = async (ctx, next) => {
  const type = ctx.query.type || null
  const userId = ctx.user._id
  let actions = [{
      $match: {
        user: userId
      }
    },
    {
      $project: {
        domain: 1
      }
    },
    {
      $lookup: {
        from: 'domains',
        foreignField: '_id',
        localField: 'domain',
        as: 'domain'
      }
    },
    {
      $project: {
        domain: {
          _id: 1,
          name: 1,
          avatar: 1,
          eventType: 1
        }
      }
    },
    {
      $unwind: '$domain'
    },
    {
      $replaceRoot: {
        newRoot: "$domain"
      }
    }
  ]
  if (type) {
    actions.push({
      $match: {
        eventType: type
      }
    })
  }
  const res = await Correlation.aggregate(actions)
  ctx.body = res
}

exports.getDomain = async (ctx, next) => {
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (!ctx.domain) {
    ctx.throw(500)
  }
  if (ctx.role.permissions.base.view) {
    const fieldsDomain = 'name,avatar,intro,eventType,eventId'.split(',')
    const domain = pick(ctx.domain, fieldsDomain)
    const fieldsRole = 'name,permissions'.split(',')
    const role = pick(ctx.role, fieldsRole)
    ctx.body = {
      code: 0,
      data: {
        domain: domain,
        role: role
      }
    }
  } else {
    ctx.throw(403)
  }
}

exports.getUsers = async (ctx, next) => {
  if (!ctx.domain) {
    ctx.throw(500)
  }
  if (!ctx.user) {
    ctx.throw(500)
  }
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (ctx.role.permissions.users.retrieve) {
    const domainId = ctx.domain._id
    let actions = [{
      $match: {
        domain: domainId
      }
    }, {
      $lookup: {
        from: 'users',
        foreignField: '_id',
        localField: 'user',
        as: 'user'
      }
    }, {
      $lookup: {
        from: 'roles',
        foreignField: '_id',
        localField: 'role',
        as: 'role'
      }
    }, {
      $project: {
        _id: 0,
        user: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        role: {
          _id: 1,
          name: 1
        }
      }
    }, {
      $unwind: '$user'
    }, {
      $unwind: '$role'
    }]
    const res = await Correlation.aggregate(actions)
    console.log(res)
    ctx.body = {
      code: 0,
      data: res
    }
  } else {
    ctx.throw(403)
  }
}

exports.addUser = async (ctx, next) => {
  if (!ctx.domain) {
    ctx.throw(500)
  }
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (!ctx.user) {
    ctx.throw(500)
  }
  if (ctx.role.permissions.users.create) {
    // 有添加用户的权限
    const userId = ctx.request.body.id
    const user = await User.findById(userId)
    const domain = ctx.domain
    if (user) {
      // 添加的用户存在
      const res = await Correlation.findOne({
        user: user,
        domain: domain
      })
      if (res) {
        ctx.throw(400)
      }
      // 添加的用户不在本域内
      try {
        await Correlation({
          user: user,
          domain: domain,
          role: domain.role.default
        }).save()
      } catch (err) {
        ctx.body = {
          success: false
        }
        return
      }
    } else {
      ctx.throw(400)
    }
  } else {
    ctx.throw(403)
  }
  ctx.body = {
    success: true
  }
}

exports.removeUser = async (ctx, next) => {
  if (!ctx.domain) {
    ctx.throw(500)
  }
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (!ctx.user) {
    ctx.throw(500)
  }
  if (ctx.role.permissions.users.delete) {
    // 有移除用户的权限
    const userId = ctx.request.body.id
    const user = await User.findById(userId)
    const domain = ctx.domain
    if (user) {
      // 移除的用户存在
      const res = await Correlation.findOne({
        user: user,
        domain: domain
      }).populate({
        path: 'role',
        select: 'permissions.base.deletable'
      })
      // 移除的用户在本域内
      if (!res) {
        ctx.throw(400)
      }
      if (res.role.permissions.base.deletable) {
        // 移除的用户可以被移除
        try {
          await Correlation.deleteOne({
            _id: res._id
          })
        } catch (err) {
          ctx.body = {
            success: false
          }
          return
        }
      } else {
        ctx.throw(400)
      }
    } else {
      ctx.throw(400)
    }
  } else {
    ctx.throw(403)
  }
  ctx.body = {
    success: true
  }
}

var { config } = require('../config')
const cdnUrl = config.cdn.url
exports.setAvatar = async (ctx, next) => {
  const body = ctx.request.body || {}
  const domainId = ctx.params.domainId
  await Domain.updateOne({
    _id: domainId
  }, {
    $set: {
      avatar: `${cdnUrl}/${body.key}`
    }
  })
  ctx.body = {
    success: true,
    url: `${cdnUrl}/${body.key}`
  }
}

exports.searchDomain = async (ctx, next) => {
  const key = ctx.request.body.keyword
  if (!key) {
    ctx.body = {
      code: 0,
      data: []
    }
    return
  }
  const domains = await Domain.find({
    $or: [
      { name: { $regex: key, $options: 'i' }},
      { intro: { $regex: key, $options: 'i' }}
    ]
  }, {
    name: 1,
    intro: 1,
    avatar: 1
  }).limit(5)
  ctx.body = {
    code: 0,
    data: domains
  }
}

/**
 * @requires ctx.domain
 * @requires ctx.role
 * @requires ctx.user
 * @returns ctx.body
 */
exports.joinDomain = async (ctx, next) => {
  if (!ctx.domain) {
    ctx.throw(500)
  }
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (ctx.role.permissions.base.join) {
    // 有加入的权限
    const user = ctx.user
    const domain = ctx.domain
    // TODO: 加入条件检查

    // 添加的用户不在本域内
    try {
      await Correlation({
        user: user,
        domain: domain,
        role: domain.role.default
      }).save()
    } catch (err) {
      ctx.body = {
        success: false
      }
      return
    }
  } else {
    ctx.throw(403)
  }
  ctx.body = {
    success: true
  }
}

/**
 * @requires ctx.domain
 * @requires ctx.role
 * @requires ctx.user
 * @returns ctx.body
 */
exports.quitDomain = async (ctx, next) => {
  if (!ctx.domain) {
    ctx.throw(500)
  }
  if (!ctx.role) {
    ctx.throw(500)
  }
  console.log(ctx.role)
  if (ctx.role.permissions.base.quit) {
    // 有退出的权限
    // TODO: 退出条件检查
    try {
      await Correlation.deleteOne({
        domain: ctx.domain,
        user: ctx.user
      })
    } catch (err) {
      ctx.body = {
        success: false
      }
      return
    }
  } else {
    ctx.throw(403)
  }
  ctx.body = {
    success: true
  }
}