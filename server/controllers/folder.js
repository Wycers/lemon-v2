'use strict'

var mongoose = require('mongoose')
var Folder = mongoose.model('Folder')
var Domain = mongoose.model('Domain')

exports.createFolder = async (ctx, next) => {
  console.log(ctx.request.body)
  console.log(ctx.params)
  const domainId = ctx.params.domainId
  const folderId = ctx.params.folderId
  if (domainId === null || domainId === undefined || domainId === '')
    ctx.throw(400, 'domain required')
  const foldername = ctx.request.body.folder || domainId

  const session = await Domain.startSession()
  session.startTransaction()
  try {
    const opts = { session };
    const folder = await Folder({
      foldername: foldername,
      belong: domainId,
      file: [],
      folder: []
    }).save(opts)
    if (folderId === null || folderId === undefined || folderId === '') {

      await Domain.updateOne({
        _id: domainId
      }, {
        $set: {
          folder: folder._id
        }
      })
    } else {
      await Folder.updateOne({
        _id: folderId
      }, {
        $push: {
          folder: folder._id 
        }
      })
    }
    await session.commitTransaction();
    session.endSession();
    ctx.body = {
      success: true
    }
  } catch(error) {
    await session.abortTransaction();
    session.endSession();

    if (error.name === 'CastError')
      ctx.throw(400, 'domain required')
    console.log(error)
    ctx.throw(500)
  }
}

var filesize = require('filesize')
exports.listFolder = async (ctx, next) => {
  const folderId = ctx.params.folderId
  let folder = await Folder.findById(folderId, {
    _id: 1,
    folder: 1,
    file: 1
  })
  .populate({
    path: 'folder', 
    select: ['_id', 'foldername', 'meta.updateAt']
  })
  .populate({
    path: 'file',
    select: ['_id', 'filename', 'meta.updateAt', 'entity'],
    populate: {
      path: 'entity',
      select: ['size']
    }
  })
  console.log(filesize(500))
  console.log(folder)
  ctx.body = folder
}