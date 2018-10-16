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
      >
      </q-btn>
      <q-btn
        @click="signup()"
        :label = "$t('signup')"
      >
      </q-btn>
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

export default {
  name: 'Steemlogin',
  data: function () {
    return {
      client: null,
      showDialog: false
    }
  },
  props: {
  },
  mounted: function () {
    this.$root.$on('login', () => this.login())
    this.$root.$on('signup', () => this.signup())

    this.$store.commit('steem/createClient', {
      app: 'steemqa-io',
      baseURL: 'https://steemconnect.com',
      callbackURL: 'http://localhost:8080/auth/callback',
      accessToken: this.$store.getters['steem/accessToken'],
      scope: ['vote', 'comment', 'custom_json']
    })

    if (localStorage.expires) {
      let now = new Date()
      let expires = new Date(localStorage.expires)

      if (now > expires) {
        this.showDialog = true
      } else {
        setTimeout(() => {
          this.showDialog = true
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
      this.$store.dispatch('steem/login')
        .then(response => {
          this.$store.getters['steem/client'].me((err, res) => {
            if (err == null) {
              this.$store.commit('steem/metadata', res.account.json_metadata)
            } else {
              console.log(err)
            }
          })
          this.$router.push('/')
        })
    },
    signup: function () {
      document.location = 'https://signup.steemit.com/?ref=' + this.$store.getters['quearn/config'].appName
    },
    logout: function () {
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
