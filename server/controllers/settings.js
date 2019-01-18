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