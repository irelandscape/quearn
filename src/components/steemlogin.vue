<template>
    <div>
        <template v-if="loggedIn">
          <q-chip
            :avatar="avatar"
            color="primary"
            @click="rightDrawerOpen = !rightDrawerOpen"
          >
          {{username}}
          </q-chip>

          <q-layout-drawer
            v-model="rightDrawerOpen"
            side = "right"
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
                <q-item-main label="Profile" />
              </q-item>
              <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
                <q-item-side icon="bookmark" />
                <q-item-main label="Bookmarks" />
              </q-item>
              <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
                <q-item-side icon="live_help" />
                <q-item-main label="My Questions" />
              </q-item>
              <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
                <q-item-side icon="message" />
                <q-item-main label="My Comments" />
              </q-item>
              <q-item @click.native="openURL('https://github.com/quasarframework/')">
                <q-item-side icon="assignment" />
                <q-item-main label="My Topics" />
              </q-item>
              <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
                <q-item-side icon="chat" />
                <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg" />
              </q-item>
              <q-item @click.native="logout()">
                <q-item-side icon="exit_to_app" />
                <q-item-main label="Logout" />
              </q-item>
            </q-list>
          </q-layout-drawer>
        </template>
        <template v-else>
          <q-btn
            @click="login()"
            label = "login"
          >
          </q-btn>
        </template>
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
      accessToken: 'access_token',
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
              console.log(res.account)
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
    }
  }
}
</script>

<style lang="stylus">
  @import '~variables'
  .q-drawer-container
    color $primary
</style>
