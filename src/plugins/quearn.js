import axios from 'axios'
import { Notify } from 'quasar'

export default ({ store, Vue }) => {
  let url = require('url')
  let q = url.parse(document.location.origin, true)
  // store.commit('quearn/serverURL', 'https://' + q.hostname + ':8443')
  store.commit('quearn/serverURL', 'http://' + q.hostname + ':8000')
  let xss = require('xss')
  store.commit('quearn/xss', new xss.FilterXSS())
  axios.get(store.getters['quearn/serverURL'] + '/configs/').then(
    function (response) {
      let config = response.data[0]
      store.commit('quearn/config', config)
      // document.title = config.appName
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
