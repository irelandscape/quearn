<template>
  <q-page>
    <q-tabs
      class="justified"
      align="center"
      :inverted="$q.theme === 'ios'"
    >
      <q-route-tab
        default slot="title" icon="home"
        name="tab-home"
        to="/"
      >
        {{ $t('home') }}
      </q-route-tab>
      <q-route-tab
        slot="title" icon="question_answer"
        name="tab-newquestion"
        to="/newquestion"
      >
        {{ $t('newquestion') }}
      </q-route-tab>

      <q-route-tab
        slot="title" icon="search"
        name="tab-search"
        to="search"
      >
        {{ $t('search') }}
      </q-route-tab>
      <q-route-tab
        slot="title" icon="info"
        name="tab-about"
        to="about"
      >
        {{ $t('about') }}
      </q-route-tab>
      <router-view/>
    </q-tabs>
  </q-page>
</template>

<script>

import axios from 'axios'

export default {
  name: 'PageMain',
  mounted: function () {
    let serverURL = this.$store.getters['steemqa/serverURL']
    let username = this.$store.getters['steem/username']
    let accessToken = this.$store.getters['steem/accessToken']

    if (username && accessToken) {
      axios.get(
        serverURL + '/steemuser/',
        {
          params: {
            username: username,
            access_token: accessToken
          }
        }
      ).then(function (response) {
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style>
</style>
