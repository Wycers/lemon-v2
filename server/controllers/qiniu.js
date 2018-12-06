var { config } = require('../config')
var qiniu = require('qiniu')
var uuid = require('uuid')
const accessKey = config.qiniu.accessKey
const secretKey = config.qiniu.secretKey
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const cdnCallback = config.cdn.callback
const cdnBucket = config.cdn.bucket
exports.upload = async (ctx, next) => {
  var body = ctx.request.body || {}
  const filename = uuid()
  const key = cdnBucket + ':' + filename
  var options = { 
    scope: key,
    callbackUrl: cdnCallback,
    callbackBody:
      '{"username":"' +
      ctx.session.username +
      '","key":"$(key)","hash":"$(etag)","fsize":"$(fsize)","bucket":"$(bucket)","name":"$(fname)"}',
    callbackBodyType: 'application/json'
  }
  var putPolicy = new qiniu.rs.PutPolicy(options)
  var uploadToken = putPolicy.uploadToken(mac)
  if (Object.keys(body).length === 0) {
    ctx.body = {
      key: filename,
      token: uploadToken
    }
  }
}

exports.callback = async (ctx, next) => {
  console.log(ctx.body)
  ctx.body = {
    success: true
  }
  // const auth = ctx.request.headers.authorization
  // if (qiniu.util.isQiniuCallback(mac, cdnCallback, null, auth) === false) {
  //   ctx.body = {
  //     success: false
  //   }
  //   return
  // }
  // ctx.body = {
  //   success: true
  // }
  // await next()
}

const panCallback = config.pan.callback
const panBucket = config.pan.bucket
exports.uploadResouce = async (ctx, next) => {
  const body = ctx.request.body || {}
  console.log(panCallback)
  console.log(panBucket)
  var options = { 
    scope: panBucket,
    callbackUrl: panCallback,
    callbackBody:
      '{"username":"' +
      ctx.session.username +
      '","key":"$(key)","hash":"$(etag)","fsize":"$(fsize)","bucket":"$(bucket)","name":"$(fname)"}',
    callbackBodyType: 'application/json'
  }
  var putPolicy = new qiniu.rs.PutPolicy(options)
  var uploadToken = putPolicy.uploadToken(mac)
  if (Object.keys(body).length === 0) {
    ctx.body = {
      token: uploadToken
    }
  }
}