import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'zh-cmn-Hans',
    messages: {
      en: require('~/locales/en.json'),
      'zh-cmn-Hant': require('~/locales/zh-cmn-Hant.json'),
      'zh-cmn-Hans': require('~/locales/zh-cmn-Hans.json')
    }
  })
}
