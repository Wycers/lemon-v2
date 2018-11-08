'use strict'

const ratelimit = require('koa-ratelimit')
const Redis = require('ioredis')
const limiter = ratelimit({
  db: new Redis(),
  duration: 30000,
  errorMessage: {
    msg: 'Reject'
  },
  id: ctx => ctx.ip,
  max: 60,
  disableHeader: true
})
module.exports = limiter
