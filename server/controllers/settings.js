'use strict'

var mongoose = require('mongoose')
var Domain = mongoose.model('Domain')
var Activity = mongoose.model('Activity')

exports.getSettings = async (ctx, next) => {
  const domainId = ctx.params.domainId
  let domain = null
  try {
    domain = await Domain.findById(domainId) 
  } catch (error) {
    if (error.name === 'CastError')
      ctx.throw(400, 'domain required')
    ctx.throw(500)
  }
  if (domain.eventType === 'activity') {
    const activity = await Activity.findById(domain.eventId, {
      acceptStart: 1,
      acceptEnd: 1,
      cancelStart: 1,
      cancelEnd: 1,
      activityStart: 1,
      activityEnd: 1,
      limit: 1
    })
    console.log(activity)
    ctx.body = {
      code: 0,
      data: {
        common: {
          name: domain.name,
          avatar: domain.avatar,
          intro: domain.intro,
          status: domain.status
        },
        event: {
          acceptStart: {
            value: activity.acceptStart,
            type: 'time'
          },
          acceptEnd: {
            value: activity.acceptEnd,
            type: 'time'
          },
          cancelStart: {
            value: activity.cancelStart,
            type: 'time'
          },
          cancelEnd: {
            value: activity.cancelEnd,
            type: 'time'
          },
          activityStart: {
            value: activity.activityStart,
            type: 'time'
          },
          activityEnd: {
            value: activity.activityEnd,
            type: 'time'
          },
          limit: {
            value: activity.limit,
            type: 'number'
          }
        }
      }
    }
  }
}

exports.setSettings = async (ctx, next) => {
  const domainId = ctx.params.domainId
  let domain = null
  try {
    domain = await Domain.findById(domainId) 
  } catch (error) {
    if (error.name === 'CastError')
      ctx.throw(400, 'domain required')
    ctx.throw(500)
  }
  if (domain.eventType === 'activity') {
    let activity = await Activity.findById(domain.eventId, {
      acceptStart: 1,
      acceptEnd: 1,
      cancelStart: 1,
      cancelEnd: 1,
      activityStart: 1,
      activityEnd: 1,
      limit: 1
    })
    const body = ctx.request.body
    console.log(body)
    activity.acceptStart = body.acceptStart
    activity.acceptEnd = body.acceptEnd
    activity.cancelStart = body.cancelStart
    activity.cancelEnd = body.cancelEnd
    activity.activityStart = body.activityStart
    activity.activityEnd = body.activityEnd
    activity.limit = body.limit
    activity = await activity.save()
    ctx.body = {
      code: 0
    }
  }
}