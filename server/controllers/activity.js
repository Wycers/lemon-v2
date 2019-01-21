
var mongoose = require('mongoose')
var Activity = mongoose.model('Activity')

exports.queryActivity = async (ctx, next) => {
  const activityId = ctx.params.activityId
  const activity = await Activity.findById(activityId)
  ctx.body = {
    code: 0,
    data: activity
  } 
}