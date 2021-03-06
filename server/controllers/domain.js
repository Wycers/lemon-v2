'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var Domain = mongoose.model('Domain')
var User = mongoose.model('User')
var Role = mongoose.model('Role')
var Activity = mongoose.model('Activity')
var util = require('../utils/authenticate')

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

  const user = await User.findOne({
    username: username
  })
  if (user === null)
  {
    ctx.body = {
      success: false
    } 
    return next
  }
  
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

    const domain = await Domain({
      name: name,
      eventType: eventType,
      eventId: event._id,
      user: [{ _id: user._id }]
    }).save(opts)

    const role = await Role({
      user: { _id: user._id },
      domain: { _id: domain._id }
    }).save(opts)

    await session.commitTransaction();
    session.endSession();
    ctx.body = {
      success: true
    }
  } catch(error) {
    await session.abortTransaction();
    session.endSession();
    ctx.body = {
      success: false
    }
    console.log(error)
    throw error;
  }
  return next 
}

exports.queryDomain = async (ctx, next) => {
  const type = ctx.query.type || null
  const username = ctx.session.username
  const user = await User.findOne({
    username: username
  })
  let res = null
  console.log(type)
  if (type === null) {
    res = await Domain.find(
      {user: {$elemMatch: { $eq: user._id }}},
      {_id: 1, name: 1}
    )
  } else {
    res = await Domain.find(
      {user: {$elemMatch: { $eq: user._id }}, type: type},
      {_id: 1, name: 1}
    )
  }
  ctx.body = res
}

exports.getDomain = async (ctx, next) => {
  const _id = ctx.params.id
  const domain = await Domain.findById(_id,  {
    "meta": 1,
    "status": 1,
    "avatar": 1,
    "intro": 1,
    "father": 1,
    "name": 1,
    "eventType": 1,
    "eventId": 1,
    "_id": 1
  })
  if (domain === null) {
    ctx.body = {
      code: -1
    }
    return next
  }
  ctx.body = {
    code: 0,
    data: domain
  }
  console.log(ctx.body)
}

exports.getRole = async (ctx, next) => {
  const domainId = ctx.params.domainId
  const userId = ctx.session.userId
  const domain = await Domain.findById(domainId)
  ctx.body = {
    code: 0,
    data: {
      isAdmin: await util.isAdministrator(userId, domain) !== null
    } 
  }
}

exports.getUsers = async (ctx, next) => {
  const _id = ctx.params.id
  const domain = await Domain.findById(_id).populate({
    path: 'user', 
    select: ['username', '_id', 'avatar']
  })
  if (domain === null) {
    ctx.throw(400, 'domain required')
  }
  ctx.body = {
    code: 0,
    data: domain.user
  }
  return next
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

// exports.getOverview = async (ctx, next) => {
//   const domainId = ctx.params.domainId
//   const domain = await Domain.findById(domainId,)
//   console.log(domain)
//   if (domain.eventType === 'activity') {
//     const activity = await Activity.findById(domain.eventId)
//     console.log(activity)
//     ctx.body = {
//       code: 0,
//       data: {
//         common: domain,
//         event: activity
//       }
//     }
//   }
// }