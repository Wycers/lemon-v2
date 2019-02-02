var { config } = require('../config')
var qiniu = require('qiniu')
var uuid = require('uuid')
var xss = require('xss')
var mongoose = require('mongoose')
var Entity = mongoose.model('Entity')
var File = mongoose.model('File')
var Folder = mongoose.model('Folder')

const accessKey = config.qiniu.accessKey
const secretKey = config.qiniu.secretKey
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const cdnUrl = config.cdn.url
const address = config.address

const cdnCallback = config.cdn.callback
const cdnBucket = config.cdn.bucket

exports.callback = async (ctx, next) => {
  const body = ctx.request.body || {}
  const auth = ctx.request.headers.authorization
  console.log(body)
  if (qiniu.util.isQiniuCallback(mac, cdnCallback, null, auth) === false) {
    ctx.body = {
      success: false
    }
    return
  }
  ctx.body = {
    success: true,
    url: `${cdnUrl}/${body.key}`
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
    }
    await session.commitTransaction();
    session.endSession();
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



const folderCallback = 'http://wycer.free.idcfengye.com/api/folder/callback'
exports.folderUpload = async (ctx, next) => {
  const body = ctx.request.body || {}
  const folderId = ctx.params.folderId || 'null'
  var options = { 
    scope: panBucket,
    callbackUrl: folderCallback,
    callbackBody: `
      {
        "userId": "${ctx.session.userId}",
        "folder": "${folderId}",
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

exports.folderCallback = async (ctx, next) => {
  const auth = ctx.request.headers.authorization
  if (qiniu.util.isQiniuCallback(mac, folderCallback, null, auth) === false) {
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
    }
    const folderId = body.folder
    await Folder.updateOne({
      _id: folderId
    }, {
      $push: {
        file: file._id 
      }
    })
    await session.commitTransaction();
    session.endSession();
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

exports.uploadUserAvatar = async (ctx, next) => {
  const userId = ctx.user._id
  console.log(userId)
  const filename = `avatar/${uuid()}`
  const key = `${cdnBucket}:${filename}`
  const options = {
    scope: key,
    callbackUrl: `${address}/api/user/${userId}/avatar/callback`,
    callbackBody: `
      {
        "key": "$(key)"
      }
    `,
    callbackBodyType: 'application/json'
  }
  var putPolicy = new qiniu.rs.PutPolicy(options)
  var uploadToken = putPolicy.uploadToken(mac)
  ctx.body = {
    key: filename,
    token: uploadToken
  }
}

exports.uploadDomainAvatar = async (ctx, next) => {
  if (!ctx.role) {
    ctx.throw(500)
  }
  if (ctx.role.permissions.settings.avatar.update) {
    const domainId = ctx.params.domainId
    const filename = `avatar/${uuid()}`
    const key = `${cdnBucket}:${filename}`
    const options = {
      scope: key,
      callbackUrl: `${address}/api/domain/${domainId}/avatar/callback`,
      callbackBody: `
        {
          "key": "$(key)"
        }
      `,
      callbackBodyType: 'application/json'
    }
    var putPolicy = new qiniu.rs.PutPolicy(options)
    var uploadToken = putPolicy.uploadToken(mac)
    ctx.body = {
      key: filename,
      token: uploadToken
    }
  } else {
    ctx.throw(403)
  }
}

exports.validate = async (ctx, next) => {
  const auth = ctx.request.headers.authorization
  if (qiniu.util.isQiniuCallback(mac, `${address}${ctx.request.url}`, null, auth) === false) {
    ctx.body = {
      success: false
    }
    return
  }
  await next()
}