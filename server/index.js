'use strict'

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const db = 'mongodb://localhost/test'

/**
 * mongoose连接数据库
 * @type {[type]}
 */
mongoose.Promise = require('bluebird')
mongoose.connect(db)

/**
 * 获取数据库表对应的js对象所在的路径
 * @type {[type]}
 */
const models_path = path.join(__dirname, './models')

/**
 * 已递归的形式，读取models文件夹下的js模型文件，并require
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
 */
var walk = function(modelPath) {
  fs.readdirSync(modelPath).forEach(function(file) {
    var filePath = path.join(modelPath, '/' + file)
    var stat = fs.statSync(filePath)

    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(filePath)
      }
    } else if (stat.isDirectory()) {
      walk(filePath)
    }
  })
}
walk(models_path)

require('babel-register')
const Koa = require('koa')
const CSRF = require('koa-csrf')
const logger = require('koa-logger')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const app = new Koa()

app.keys = ['zhangivon']
app.use(logger())
app.use(session(app))
app.use(bodyParser())
app.use(
  new CSRF({
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
    disableQuery: false
  })
)

/**
 * 使用路由转发请求
 * @type {[type]}
 */
const router = require('./route/router')()

app.use(async (ctx, next) => {
  ctx.cookies.set('csrf', ctx.csrf, {
    domain: 'localhost', // 写cookie所在的域名
    path: '/', // 写cookie所在的路径
    maxAge: 2 * 60 * 60 * 1000, // cookie有效时长
    expires: new Date('2018-12-08'), // cookie失效时间
    httpOnly: false, // 是否只用于http请求中获取
    overwrite: false // 是否允许重写
  })
  await next()
})

app.use(router.routes()).use(router.allowedMethods())

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')


// app.use(async (ctx, next) => {
//   consola.log(ctx)
//   ctx.cookies.set('csrf', ctx.csrf, {
//     domain: 'localhost', // 写cookie所在的域名
//     path: '/', // 写cookie所在的路径
//     maxAge: 2 * 60 * 60 * 1000, // cookie有效时长
//     expires: new Date('2018-12-08'), // cookie失效时间
//     httpOnly: false, // 是否只用于http请求中获取
//     overwrite: true // 是否允许重写
//   })
//   await next()
// })

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
