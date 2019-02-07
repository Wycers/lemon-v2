module.exports = {
  qiniu: {
    accessKey: process.env.LEMON_QINIU_AK,
    secretKey: process.env.LEMON_QINIU_SK
  },
  host: process.env.LEMON_HOST || 
    process.env.NODE_ENV === 'development'
      ? '0.0.0.0'
      : 'localhost',
  port: process.env.LEMON_PORT || 3000,
  callback: process.env.LEMON_CALLBACK,
  mongo: {
    host: process.env.LEMON_MONGO_HOST ||
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'host.docker.internal',
    port: process.env.LEMON_MONGO_PORT || 27017
  },
  redis: {
    host: process.env.LEMON_REDIS_HOST || 
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'host.docker.internal',
    port: process.env.LEMON_REDIS_PORT || 6379
  },
  cdn: {
    bucket: process.env.LEMON_CDN_BUCKET || 'file',
    url: process.env.LEMON_CDN_URL || 'http://cdn.wycer.cn'
  },
  pan: {
    bucket: process.env.LEMON_PAN_BUCKET || 'disk',
    url: process.env.LEMON_PAN_URL || 'http://pan.wycer.cn'
  }
}
