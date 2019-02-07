# lemon-v2

[![Build Status](https://www.travis-ci.org/Wycers/lemon-v2.svg?branch=master)](https://www.travis-ci.org/Wycers/lemon-v2)

> My magnificent Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
# lemon-v2


## TODOS
- [ ] 登录验证码
- [x] 登录态
- [x] Travis
- [x] 用户信息设置
- [ ] 绑定CAS账号
- [ ] 脚注
- [x] Docker部署
- [x] Docker-compose
- [ ] 域 - 问卷功能
- [ ] 域 - 工作流功能
- [ ] 域 - 资源功能
- [ ] 域 - 通知功能

## 环境变量
- NODE_ENV: 项目运行模式。默认为'development'。
- LEMON_HOST: 项目监听地址。开发环境默认为'0.0.0.0'，生产环境默认为'localhost'。
- LEMON_PORT: 项目监听端口。默认为3000。
- LEMON_CALLBACK: 项目API回调地址。
- LEMON_MONGO_HOST: 项目MongoDB地址。开发环境默认为'localhost', 生产环境默认为'host.docker.internal'。
- LEMON_MONGO_PORT: 项目MongoDB端口。默认为27017。
- LEMON_REDIS_HOST: 项目Redis地址。开发环境默认为'localhost', 生产环境默认为'host.docker.internal'。
- LEMON_REDIS_PORT: 项目Redis端口。默认为6379。
- LEMON_QINIU_AK: 项目所用七牛云服务AK。
- LEMON_QINIU_SK: 项目所有七牛云服务SK。
- LEMON_CDN_BUCKET: 项目CDN加速文件存放的bucket名字。
- LEMON_CDN_URL: 项目CDN域名。
- LEMON_PAN_BUCKET: 项目网盘文件存放的bucket名字。
- LEMON_PAN_URL: 项目网盘的域名。默认为