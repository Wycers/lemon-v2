const baseUrl = 'http://localhost:3000'
const config = {
  locale: 'en-US', // en-US, zh-CN
  url: baseUrl,
  ajaxUploadUrl: `${baseUrl}/api/upload`,
  debug: {
    mock: false, // enable mock
    http: true // http request log
  },
  api: `${baseUrl}/api`
}
export default config
