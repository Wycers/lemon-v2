'use strict'

var xss = require('xss')
var uuid = require('uuid')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var userHelper = require('../dbhelper/userHelper')
var { config } = require('../config')
// import userHelper from '../dbhelper/userHelper'
const cdnurl = config.qiniu.url
/**
 * 注册新用户
 * @param {Function} next          [description]
 * @yield {[type]}   [description]
 */
exports.signup = async (ctx, next) => {
  // var phoneNumber = xss(ctx.request.body.phoneNumber.trim())
  const username = ctx.request.body.username
  const password = ctx.request.body.password
  var user = await User.findOne({
    username: username
  }).exec()
  console.log(user)
  var verifyCode = Math.floor(Math.random() * 10000 + 1)
  if (!user) {
    var token = uuid.v4()

    user = new User({
      username: username,
      password: password,
      nickname: '测试用户',
      avatar:
        'http://upload-images.jianshu.io/upload_images/5307186-eda1b28e54a4d48e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      verifyCode: verifyCode,
      token: token
    })
    try {
      user = await user.save()
      const token = uuid.v4()
      ctx.session = {
        username: username,
        token: token
      }
      ctx.body = {
        success: true,
        user: {
          avatar: user.avatar,
          nickname: user.nickname,
          token: token
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        success: false
      }
    }
  } else {
    user.verifyCode = verifyCode
    ctx.body = {
      success: false
    }
  }
  return next
}

/**
 * 更新用户信息操作
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.update = async (ctx, next) => {
  var body = ctx.request.body
  var user = ctx.session.user
  var fields = 'avatar,gender,age,nickname,breed'.split(',')

  fields.forEach(function(field) {
    if (body[field]) {
      user[field] = xss(body[field].trim())
    }
  })

  user = await user.save()

  ctx.body = {
    success: true,
    data: {
      nickname: user.nickname,
      token: user.token,
      avatar: user.avatar,
      age: user.age,
      breed: user.breed,
      gender: user.gender,
      _id: user._id
    }
  }
}

exports.signin = async (ctx, next) => {
  const username = ctx.request.body.username
  const password = ctx.request.body.password
  var user = await User.findOne({
    username: username,
    password: password
  }).exec()
  if (user === null) {
    ctx.body = {
      success: false,
      data: 'unmatch'
    }
  } else {
    const token = uuid.v4()
    console.log(token)
    user.token = token
    user = await user.save()
    ctx.session = {
      username: username,
      token: token
    }
    ctx.body = {
      success: true,
      user: {
        avatar: user.avatar,
        nickname: user.nickname,
        token: token
      }
    }
  }
}

exports.signout = async (ctx, next) => {
  const token = ctx.request.body.token
  console.log(token)
  console.log(ctx.session)
  if (ctx.session.token === token) {
    ctx.session = {}
    ctx.body = {
      success: true
    }
  }
}

/**
 * 数据库接口测试
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.users = async (ctx, next) => {
  var data = await userHelper.findAllUsers()
  // var obj = await userHelper.findByPhoneNumber({phoneNumber : '13525584568'})
  // console.log('obj=====================================>'+obj)

  ctx.body = {
    success: true,
    data
  }
}
exports.addUser = async (ctx, next) => {
  var user = new User({
    nickname: '测试用户',
    avatar: 'http://ip.example.com/u/xxx.png',
    // phoneNumber: xss('13800138000'),
    verifyCode: '5896',
    token: uuid.v4()
  })
  var user2 = await userHelper.addUser(user)
  if (user2) {
    ctx.body = {
      success: true,
      data: user2
    }
  }
}
exports.deleteUser = async (ctx, next) => {
  // const phoneNumber = xss(ctx.request.body.phoneNumber.trim())
  // console.log(phoneNumber)
  // var data = await userHelper.deleteUser({ phoneNumber })
  ctx.body = {
    success: true,
    data
  }
}

exports.setAvatar = async (ctx, next) => {
  const username = ctx.request.body.username
  const filename = ctx.request.body.key
  if (username === null || username === undefined || username === '') {
    ctx.body = {
      success: false
    }
    console.log('qwq')
    return
  }
  var user = await User.findOne({
    username: username
  }).exec()
  user.avatar = `${cdnurl}${filename}`
  try {
    user = await user.save()
    const token = uuid.v4()
    ctx.session = {
      username: username,
      token: token
    }
    ctx.body = {
      success: true,
      user: {
        avatar: user.avatar,
        nickname: user.nickname,
        token: token
      }
    }
  } catch (e) {
    ctx.body = {
      success: false
    }
  }
}
