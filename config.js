const baseUrl = process.env.baseUrl
const config = {
  locale: 'en-US', // en-US, zh-CN
  url: baseUrl,
  debug: {
    mock: false, // enable mock
    http: process.env.NODE_ENV === 'development' // http request log
  },
  api: `${baseUrl}/api`
}
export default config
