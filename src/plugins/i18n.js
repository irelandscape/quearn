// we import the external package
import VueI18n from 'vue-i18n'
import VueTimeago from 'vue-timeago'

// let's say we have a file in /src/i18n containing the language pack
import messages from 'src/i18n'

export default ({ app, Vue }) => {
  // we tell Vue to use our Vue package:
  Vue.use(VueI18n)

  // Set i18n instance on app;
  // We inject it into root component by doing so;
  // new Vue({..., i18n: ... }).$mount(...)

  app.i18n = new VueI18n({
    locale: 'en-us',
    fallbackLocale: 'en-us',
    messages
  })

  Vue.use(VueTimeago, {
    name: 'Timeago', // Component name, `Timeago` by default
    locale: 'en-us', // Default locale
    // We use `date-fns` under the hood
    // So you can use all locales from it
    locales: {
      'en-us': require('date-fns/locale/en'),
      'fr': require('date-fns/locale/fr')
    }
  })
}
