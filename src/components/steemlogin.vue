<template>
  <div v-if="loggedIn">
    <q-chip
      :avatar="avatar"
      color="primary"
      square
      @click="rightDrawerOpen = !rightDrawerOpen"
      class="nobackground"
    >
      {{username}}
    </q-chip>

    <q-layout-drawer
      v-model="rightDrawerOpen"
      side = "right"
      :overlay=true
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>My Account</q-list-header>
        <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="account_box" />
          <q-item-main :label="$tc('myaccount')" />
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="bookmark" />
          <q-item-main :label="$tc('bookmark', 2)" />
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="contact_support" />
          <q-item-main :label="$t('myquestions')" />
        </q-item>

        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="check_circle" />
          <q-item-main :label="$t('myanswers')" />
        </q-item>

        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="message" />
          <q-item-main :label="$t('mycomments')" />
        </q-item>
        <q-item @click.native="myTopics">
          <q-item-side icon="assignment" />
          <q-item-main :label="$t('mytopics')" />
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="chat" />
          <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg" />
        </q-item>
        <q-item @click.native="logout()">
          <q-item-side icon="exit_to_app" />
          <q-item-main :label="$t('logout')" />
        </q-item>
      </q-list>
    </q-layout-drawer>
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
      client: null,
      rightDrawerOpen: this.$q.platform.is.desktop
    }
  },
  props: {
  },
  mounted: function () {
    this.$store.commit('steem/createClient', {
      app: 'steemqa-io',
      callbackURL: 'http://localhost:8080/auth/callback',
      accessToken: this.$store.getters['steem/accessToken'],
      scope: ['vote', 'comment']
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
  .q-drawer-container
    color $primary

  >>> .nobackground
    background: none !important;
</style>
