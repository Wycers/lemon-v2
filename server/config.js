exports.config = {
  qiniu: {
  },
  cdn: {
    bucket: 'file',
    url: 'http://cdn.wycer.cn/',
    callback: 'https://cac1d59c.ngrok.io/api/qiniu/callback'
  },
  pan: {
    bucket: 'disk',
    url: 'http://pan.wycer.cn/',
    callback: 'https://cac1d59c.ngrok.io/api/qiniu/callback'
  }
}
