import axios from 'axios'
import { Notify } from 'quasar'

export default ({ store, Vue }) => {
  // store.commit('steemqa/serverURL', 'http://127.0.0.1:8000')
  store.commit('steemqa/serverURL', 'http://192.168.192.54:8000')
  axios.get(store.getters['steemqa/serverURL'] + '/configs/').then(
    function (response) {
      store.commit('steemqa/config', response.data[0])
    }).catch(
    function (error) {
      console.log(error)
      Notify.create('Failed to contact API Server')
    })
  axios.get(store.getters['steemqa/serverURL'] + '/topics/').then(
    function (response) {
      store.commit('steemqa/topics', response.data)
    }).catch(
    function (error) {
      console.log(error)
      Notify.create('Failed to contact API Server')
    })

  if (store.getters['steem/username']) {
    axios.get(store.getters['steemqa/serverURL'] + '/bookmarks/',
      {
        params: {
          username: store.getters['steem/username'],
          access_token: store.getters['steem/accessToken']
        }
      }
    ).then(function (response) {
      store.commit('steemqa/bookmarks', response.data)
    }).catch(function (error) {
      console.log(error)
      Notify.create('Failed to contact API Server')
    })
  }
}
