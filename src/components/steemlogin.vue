<template>
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
  </div>
</template>

<script>

export default {
  name: 'Steemlogin',
  data: function () {
    return {
      client: null
    }
  },
  props: {
  },
  mounted: function () {
    this.$root.$on('login', () => this.login())

    this.$store.commit('steem/createClient', {
      app: 'steemqa-io',
      baseURL: 'https://steemconnect.com',
      callbackURL: 'http://localhost:8080/auth/callback',
      accessToken: this.$store.getters['steem/accessToken'],
      scope: ['vote', 'comment', 'custom_json']
    })
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
    logout: function () {
      this.$store.commit('steem/logout')
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
