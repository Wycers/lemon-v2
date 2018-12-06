var { config } = require('../config')
var qiniu = require('qiniu')
var uuid = require('uuid')
var xss = require('xss')
var mongoose = require('mongoose')
var Entity = mongoose.model('Entity')
var File = mongoose.model('File')

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
    callbackBody: `
      {
        "username": "${ctx.session.username}",
        "key": "$(key)",
        "hash":"$(etag)",
        "fsize":"$(fsize)",
        "fname":"$(fname)"
      }
    `,
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
  const body = ctx.request.body || {}
  const auth = ctx.request.headers.authorization
  if (qiniu.util.isQiniuCallback(mac, cdnCallback, null, auth) === false) {
    ctx.body = {
      success: false
    }
    return
  }
  ctx.body = {
    success: true
  }
}

const panCallback = config.pan.callback
const panBucket = config.pan.bucket
exports.resourceUpload = async (ctx, next) => {
  const body = ctx.request.body || {}
  const domainId = ctx.params.id || 'null'
  var options = { 
    scope: panBucket,
    callbackUrl: panCallback,
    callbackBody: `
      {
        "userId": "${ctx.session.userId}",
        "domain": "${domainId}",
        "key": "$(key)",
        "hash":"$(etag)",
        "mimeType": "$(mimeType)",
        "fsize":"$(fsize)",
        "fname":"$(fname)"
      }
    `,
    callbackBodyType: 'application/json'
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  if (Object.keys(body).length === 0) {
    ctx.body = {
      token: uploadToken
    }
  }
}
exports.resourceCallback = async (ctx, next) => {
  const auth = ctx.request.headers.authorization
  if (qiniu.util.isQiniuCallback(mac, panCallback, null, auth) === false) {
    ctx.body = {
      success: false
    }
    return
  }
  const body = ctx.request.body || {}
  console.log(body)
  const session = await Entity.startSession()
  session.startTransaction()
  try {
    const opts = { session };
    let entity = await Entity.findOne({ key: body.key });
    if (entity === null) {
      entity = await Entity({
        key: body.key,
        mimeType: body.mimeType,
        size: body.fsize
      }).save(opts)
    }
    let file = await File.findOne({
      owner: body.userId,
      entity: entity._id
    })
    if (file === null) {
      file = await File({
        filename: xss(body.fname.trim()),
        owner: body.userId,
        entity: entity._id
      }).save(opts)
      await session.commitTransaction();
      session.endSession();
    }
    ctx.body = {
      success: true
    }
  } catch(error) {
    console.log(error)
    await session.abortTransaction();
    session.endSession();
    ctx.body = {
      success: false
    }
    throw error;
  }
}