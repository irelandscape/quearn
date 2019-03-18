<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>

import axios from 'axios'
import { Notify } from 'quasar'
import { decryptAuthDetails } from 'components/utils/steem'

export default {
  name: 'App',
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return axios.get(store.getters['quearn/serverURL'] + '/configs/').then(
      (response) => {
        let config = response.data[0]
        store.commit('quearn/config', config)
        // document.title = config.appName

        store.commit('quearn/removePatterns', new RegExp('\\*\\*' + config.appName + ' [Nn]otice:.*\n*', 'g'))
      }).catch(
      (error) => {
        console.log(error)
        Notify.create('Failed to contact API Server')
      })
      .then(() => {
        if (store.getters['steem/authDetails']) {
          return decryptAuthDetails(store.getters['steem/authDetails'])
            .then((authDetails) => {
              axios.get(store.getters['quearn/serverURL'] + '/bookmarks/',
                {
                  params: {
                    username: store.getters['steem/username'],
                    posting_key: authDetails.steemPostingKey
                  }
                }
              ).then(function (response) {
                store.commit('quearn/bookmarks', response.data)
              }).catch(function (error) {
                console.log(error)
                Notify.create('Failed to contact API Server')
              })
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
      .then(() => {
        axios.get(store.getters['quearn/serverURL'] + '/topics/').then(
          (response) => {
            store.commit('quearn/topics', response.data)
          }).catch(
          (error) => {
            console.log(error)
            Notify.create('Failed to contact API Server')
          })
      })
  }
}
</script>

<style>
</style>
