'usr strict'

exports.pick = (obj, keys) => {
  return keys
    .map(key => key in obj ? {
      [key]: obj[key]
    } : {})
    .reduce((res, o) => Object.assign(res, o), {})
}
