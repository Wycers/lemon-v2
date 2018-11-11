import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.api,
  timeout: 1000
  // headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})

http.interceptors.request.use(
  req => {
    return req
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  res => {
    const request = res.config
    if (config.debug.http) {
      console.log(
        '>>>',
        request.method.toUpperCase(),
        request.url,
        request.params,
        '\n   ',
        res.status,
        res.data
      )
    }
    return res
  },
  error => {
    if (config.debug.http) {
      let { res, config: request } = error
      if (request) {
        console.log(
          '>>>',
          equest.method.toUpperCase(),
          request.url,
          request.params,
          '\n   ',
          res.status,
          res.data
        )
      }
    }
    // Do something with response error
    return Promise.reject(error)
  }
)

export default http
