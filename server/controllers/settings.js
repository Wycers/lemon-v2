'use strict'

var mongoose = require('mongoose')
var Activity = mongoose.model('Activity')
var { pick } = require('../utils/select')

exports.getSettings = async (ctx, next) => {
  if (!ctx.domain) {
    ctx.throw(500)
  }
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (!ctx.role.permissions.settings.enter) {
    ctx.throw(403)
  }
  const domain = ctx.domain
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
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (!ctx.domain) {
    ctx.throw(500)
  }
  const fields = 'name,intro,status'.split(',')
  const body = pick(ctx.request.body, fields)
  fields.forEach(field => {
    if (ctx.domain[field] == body[field]) {
      return
    } else {
      if (ctx.role.permissions.settings[field].update) {
        ctx.domain[field] = body[field]
      } else {
        ctx.throw(403)
      }
    }
  })
  await ctx.domain.save()
  if (ctx.domain.eventType === 'activity') {
    let activity = await Activity.findById(ctx.domain.eventId)
    const fields = 'acceptStart,acceptEnd,cancelStart,cancelEnd,activityStart,activityEnd, limit'.split(',')
    const body = pick(ctx.request.body, fields)
    fields.forEach(field => {
      if (activity[field] == body[field]) {
        return
      } else {
        if (ctx.role.permissions.settings.event) {
          activity[field] = body[field]
        } else {
          ctx.throw(403)
        }
      }
    })
    await activity.save()
    ctx.body = {
      success: true
    }
  }
}