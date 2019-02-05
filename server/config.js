export default {
  qiniu: {
    accessKey: process.env.LEMON_QINIU_AK,
    secretKey: process.env.LEMON_QINIU_SK
  },
  address: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.LEMON_ADDRESS,
  cdn: {
    bucket: process.env.LEMON_CDN_BUCKET || 'file',
    url: process.env.LEMON_CDN_URL || 'http://cdn.wycer.cn'
  },
  pan: {
    bucket: process.env.LEMON_PAN_BUCKET || 'disk',
    url: process.env.LEMON_PAN_URL || 'http://pan.wycer.cn'
  }
}
