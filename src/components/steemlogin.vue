<template>
  <div>
    <div v-if="loggedIn">
      <q-chip
        :avatar="avatar"
        color="primary"
        square
        class="nobackground"
      >
        {{username}}
      </q-chip>
    </div>
    <div v-else>
      <q-btn
        @click="login()"
        :label = "$t('login')"
        class="float-left"
      />
      <SteemSignup class="float-left" />
    </div>
    <q-dialog
      v-model="showDialog"
      :title="$tc('sessionexpired')"
      @ok="logout()"
      prevent-close
    />
  </div>
</template>

<script>

import SteemSignup from 'components/steemsignup'

export default {
  name: 'Steemlogin',
  components: {
    SteemSignup
  },
  data: function () {
    return {
      client: null,
      showDialog: false
    }
  },
  props: {
  },
  mounted: function () {
    this.$root.$on('session-expired', () => {
      this.showDialog = true
    })

    this.$root.$on('login', () => this.login())

    if (localStorage.expires) {
      let now = new Date()
      let expires = new Date(localStorage.expires)

      if (now > expires) {
        this.showDialog = true
      } else {
        window.session_timer = setTimeout(() => {
          this.$root.$emit('session-expired')
        }, expires - now)
      }
    }
  },
  computed: {
    loggedIn () {
      return this.$store.getters['steem/loggedIn']
    },
    avatar () {
      return this.$store.getters['steem/avatar']
    },
    username () {
      return this.$store.getters['steem/username']
    }
  },
  methods: {
    login: function () {
      const url = this.$store.getters['quearn/config'].steemlogin_auth_url +
        '?app=' + encodeURI(this.$store.getters['quearn/config'].appName)
      if (process.env.DEV) {
        window.location = url + '&dev'
      } else {
        let isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1

        if (isCordovaApp) {
          let win = cordova.InAppBrowser.open(url, '_blank', 'location=no')
          win.addEventListener('loadstart', (event) => {
            let s = new URLSearchParams(event.url.split('?')[1])
            let params = {}
            for (let pair of s.entries()) {
              params[pair[0]] = pair[1]
            }

            if (event.url.indexOf('steemlogin/success') > 0) {
              win.close()
              this.$router.push({
                path: '/steemlogin/success',
                query: params
              })
            } else if (event.url.indexOf('steemlogin/failure') > 0) {
              win.close()
              this.$router.push({
                path: '/steemlogin/failure',
                query: params
              })
            }
          })
        } else {
          window.location = url
        }
      }
    },
    signup: function () {
      document.location = 'https://signup.steemit.com/?ref=' + this.$store.getters['quearn/config'].appName
    },
    logout: function () {
      if (window.session_timer) {
        clearTimeout(window.session_timer)
        window.session_timer = null
      }
      this.$store.dispatch('steem/logout')
    },
    myTopics: function () {
      this.$router.push('my_topics')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~variables'

  >>> .nobackground
    background: none !important;
</style>
