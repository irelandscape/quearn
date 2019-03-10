<template>
  <div/>
</template>

<script>

import axios from 'axios'
import { Loading } from 'quasar'
export default {

  name: 'steemLoginSuccess',
  mounted () {
    if (!this.$route.query.authCode) {
      this.$q.notify({
        message: this.$tc('loginwithoutauthcode:'),
        type: 'negative'
      })
    }

    this.$q.loading.show({
      delay: 400
    })

    const url = this.$store.getters['quearn/config'].steemlogin_auth_url +
      '/authDetails?authCode=' + this.$route.query.authCode

    axios.get(url).then(
      (response) => {
        if (response.data === '{}') {
          throw new Error('No authentication details from Steemlogin!')
        }

        this.$store.dispatch('steem/authDetails', response.data).then(() => {
          Loading.hide()
          this.$router.push('/')
        })
      }).catch(
      (error) => {
        console.log(error)
        Loading.hide()
        this.$router.push('/')
      })
  }
}

</script>
