'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var Domain = mongoose.model('Domain')
var User = mongoose.model('User')
var Correlation = mongoose.model('Correlation')
var Activity = mongoose.model('Activity')
var util = require('../utils/authenticate')

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
  const username = ctx.session.username
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

    const { guest, admin } = require('../dbhelper/roleHelper')
    const domain = await Domain({
      name: name,
      eventType: eventType,
      eventId: event._id,
      role: {
        guest: guest,
        admin: admin,
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
    const domain = (({
      name,
      avatar,
      intro,
      eventType,
      eventId
    }) => ({
      name,
      avatar,
      intro,
      eventType,
      eventId
    }))(ctx.domain)
    ctx.body = {
      code: 0,
      data: {
        domain: domain,
        role: ctx.role
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
  const domainId = ctx.params.id
  const userId = ctx.request.body.id
  try {
    await User.findById(userId)
  } catch (error) {
    if (error.name === 'CastError')
      ctx.throw(400, 'user required')
    ctx.throw(500)
  }
  try {
    const res = await Domain.findOne({_id: domainId, user: {$elemMatch: { $eq: userId }}})
    if (res != null) {
      ctx.body = {
        success: true
      }
      return next
    }
  } catch (error) {
    if (error.name === 'CastError')
      ctx.throw(400, 'domain required')
    ctx.throw(500)
  }
  try {
    await Domain.updateOne({ _id: domainId }, { $push: { user: userId }})
  } catch (error) {
    ctx.throw(500)
  }
  ctx.body = {
    success: true
  }
}

exports.removeUser = async (ctx, next) => {
  const domainId = ctx.params.id
  const userId = ctx.request.body.id
  console.log(userId)
  if (userId === null || userId === undefined || userId === '') 
    ctx.throw(400, 'user required')

  const domain = await Domain.findById(domainId)
  if (await util.isAdministrator(userId, domain) !== null) {
    ctx.body = {
      success: false
    }
    return next
  }
  try {
    await Domain.findOne({_id: domainId, user: {$elemMatch: { $eq: userId }}})
  } catch (error) {
    if (error.name === 'CastError')
      ctx.throw(400, 'domain required')
    ctx.throw(500)
  }
  try {
    await Domain.updateOne({ _id: domainId}, { $pull: { user: userId }})
  } catch (error) {
    ctx.throw(500)
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
  console.log(body)
  await Domain.updateOne({
    _id: domainId
  }, {
    $set: {
      avatar: `${cdnUrl}/${body.key}`
    }
  })
  console.log(domainId)
  ctx.body = {
    success: true,
    url: `${cdnUrl}/${body.key}`
  }
}

exports.searchDomain = async (ctx, next) => {
  console.log(ctx.request.body)
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

exports.joinDomain = async (ctx, next) => {
  const domainId = ctx.params.domainId
  try {
    const res = await Domain.findOne(
      {
        _id: domainId,
        user: {
          $elemMatch: { $eq: ctx.user._id }
        }
      },
      {_id: 1, name: 1}
    )
    if (res) {
      ctx.body = {
        code: -2,
        msg: "already in"
      }
      return
    }
    await Domain.updateOne({ _id: domainId }, { $push: { user: ctx.user._id }})
  } catch (error) {
    console.log(error)
    ctx.throw(500)
  }
  ctx.body = {
    code: 0
  }
}

exports.quitDomain = async (ctx, next) => {
  const domainId = ctx.params.domainId
  try {
    const res = await Domain.findOne(
      {
        _id: domainId,
        user: {
          $elemMatch: { $eq: ctx.user._id }
        }
      },
      {_id: 1, name: 1}
    )
    if (!res) {
      ctx.body = {
        code: -2,
        msg: "not in"
      }
      return
    }
    await Domain.updateOne({ _id: domainId}, { $pull: { user: ctx.user._id }})
  } catch (error) {
    console.log(error)
    ctx.throw(500)
  }
  ctx.body = {
    code: 0
  }
}