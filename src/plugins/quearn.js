import axios from 'axios'
import { Notify } from 'quasar'

export default ({ store, Vue }) => {
  if (process.env.NODE_ENV === 'development') {
    store.commit('quearn/serverURL', 'http://localhost:8000/api')
  } else {
    let url = require('url')
    let q = url.parse(document.location.origin, true)
    store.commit('quearn/serverURL', 'https://' + q.hostname + '/api')
    // store.commit('quearn/serverURL', 'https://api.stemq.com')
  }
  let xss = require('xss')
  store.commit('quearn/xss', new xss.FilterXSS({
    onTagAttr: function (tag, name, value, isWhiteAttr) {
      if (tag === 'div' && name === 'class') {
        if (value === 'pull-left' || value === 'pull-right' || value === 'text-justify') {
          return 'class="' + value + '"'
        }
      }
    }
  }))
  axios.get(store.getters['quearn/serverURL'] + '/configs/').then(
    function (response) {
      let config = response.data[0]
      store.commit('quearn/config', config)
      // document.title = config.appName

      store.commit('quearn/removePatterns', new RegExp('\\*\\*' + config.appName + ' [Nn]otice:.*\n*', 'g'))
    }).catch(
    function (error) {
      console.log(error)
      Notify.create('Failed to contact API Server')
    })
  axios.get(store.getters['quearn/serverURL'] + '/topics/').then(
    function (response) {
      store.commit('quearn/topics', response.data)
    }).catch(
    function (error) {
      console.log(error)
      Notify.create('Failed to contact API Server')
    })

  if (store.getters['steem/username']) {
    axios.get(store.getters['quearn/serverURL'] + '/bookmarks/',
      {
        params: {
          username: store.getters['steem/username'],
          access_token: store.getters['steem/accessToken']
        }
      }
    ).then(function (response) {
      store.commit('quearn/bookmarks', response.data)
    }).catch(function (error) {
      console.log(error)
      Notify.create('Failed to contact API Server')
    })
  }
}
