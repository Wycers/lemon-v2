'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * 定义一个模式(相当于传统意义的表结构)
 * 每个模式映射mongoDB的一个集合，
 * 它定义（只是定义，不是实现）这个集合里面文档的结构，就是定义这个文档有什么字段，字段类型是什么，字段默认值是什么等。
 * 除了定义结构外，还定义文档的实例方法，静态模型方法，复合索引，中间件等
 * @type {mongoose}
 */
var roleSchema = new Schema({
  name: {
    type: String
  },
  permissions: {
    base: {
      view: {
        type: Boolean,
        default: true
      },
      join: {
        type: Boolean,
        default: true
      },
      quit: {
        type: Boolean,
        default: true
      },
      deletable: {
        type: Boolean,
        default: true
      }
    },
    // in user tab
    users: {
      enter: {
        type: Boolean,
        default: true
      },
      retrieve: {
        type: Boolean,
        default: true
      },
      create: {
        type: Boolean,
        default: true
      },
      delete: {
        type: Boolean,
        default: false
      }
    },
    // in settings tab
    settings: {
      enter: {
        type: Boolean,
        default: false
      },
      name: {
        update: {
          type: Boolean,
          default: false
        }
      },
      intro: {
        update: {
          type: Boolean,
          default: false
        }
      },
      avatar: {
        update: {
          type: Boolean,
          default: false
        }
      },
      status: {
        update: {
          type: Boolean,
          default: false
        } 
      },
      event: {
        update: Boolean,
        default: false
      }
    }
  },
  meta: {
    createAt: {
      type: Date,
      dafault: Date.now()
    },
    updateAt: {
      type: Date,
      dafault: Date.now()
    }
  }
})

// Defines a pre hook for the document.
roleSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

/**
 * 定义模型Notice
 * 模型用来实现我们定义的模式，调用mongoose.model来编译Schema得到Model
 * @type {[type]}
 */
// 参数Notice 数据库中的集合名称, 不存在会创建.
var Role = mongoose.model('Role', roleSchema)

module.exports = Role