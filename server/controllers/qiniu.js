var { config } = require('../config')
var qiniu = require('qiniu')
var uuid = require('uuid')
const accessKey = config.qiniu.accessKey
const secretKey = config.qiniu.secretKey
const callback = config.qiniu.callback
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

exports.upload = async (ctx, next) => {
  var body = ctx.request.body || {}
  const filename = uuid()
  const key = 'file' + ':' + filename
  var options = {
    scope: key,
    callbackUrl: callback,
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
  const auth = ctx.request.headers.authorization
  if (qiniu.util.isQiniuCallback(mac, callback, null, auth) === false) {
    ctx.body = {
      success: false
    }
    return
  }
  ctx.body = {
    success: true
  }
  await next()
}
