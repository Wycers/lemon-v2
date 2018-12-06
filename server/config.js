exports.config = {
  qiniu: {
  },
  cdn: {
    bucket: 'file',
    url: 'http://cdn.wycer.cn/',
    callback: 'http://wycer.free.idcfengye.com/api/qiniu/callback'
  },
  pan: {
    bucket: 'disk',
    url: 'http://pan.wycer.cn/',
    callback: 'http://wycer.free.idcfengye.com/api/resource/callback'
  }
}
