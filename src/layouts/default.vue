<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat dense round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ appName }}
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>

        <steemlogin></steemlogin>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      side = "left"
      :breakpoint = 99999
      :overlay=false
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <q-item @click.native="myBookmarks"
          v-if="this.$store.getters['steem/loggedIn']"
        >
          <q-item-side icon="bookmark" />
          <q-item-main :label="$tc('mybookmarks')" />
        </q-item>
        <q-item @click.native="myQuestions"
          v-if="this.$store.getters['steem/loggedIn']"
        >
          <q-item-side icon="contact_support" />
          <q-item-main :label="$t('myquestions')" />
        </q-item>

        <q-item @click.native="myAnswers"
          v-if="this.$store.getters['steem/loggedIn']"
        >
          <q-item-side icon="check_circle" />
          <q-item-main :label="$t('myanswers')" />
        </q-item>

        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')"
          v-if="this.$store.getters['steem/loggedIn']"
        >
          <q-item-side icon="message" />
          <q-item-main :label="$t('mycomments')" />
        </q-item>
        <q-item @click.native="myTopics"
          v-if="this.$store.getters['steem/loggedIn']"
        >
          <q-item-side icon="remove_red_eye" />
          <q-item-main :label="$t('mytopics')" />
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/KtYAr7c')">
          <q-item-side icon="chat" />
          <q-item-main label="Discord Channel" sublabel="https://discord.gg/KtYAr7c" />
        </q-item>
        <q-item @click.native="logout()"
          v-if="this.$store.getters['steem/loggedIn']"
        >
          <q-item-side icon="exit_to_app" />
          <q-item-main :label="$t('logout')" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
      <editpostdialog />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import Steemlogin from 'components/steemlogin'
import Pagemain from 'pages/main'
import Pagequestion from 'pages/question'
import Editpostdialog from 'components/editpostdialog'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    appName () {
      let config = this.$store.getters['quearn/config']

      if (config) {
        return config.appName
      } else {
        return ''
      }
    }
  },
  methods: {
    openURL,
    showquestion: function () {
      console.log('hello')
    },
    myBookmarks: function () {
      this.$router.push('bookmarks')
    },
    myQuestions: function () {
      this.$router.push('userquestions')
    },
    myAnswers: function () {
      this.$router.push('useranswers')
    },
    logout: function () {
      this.$store.commit('steem/logout')
    }
  },
  components: {
    Steemlogin,
    Pagemain,
    Pagequestion,
    Editpostdialog
  }
}
</script>

<style lang="stylus">
  @import '~variables'
  body
    background: #eeeeee;
  .q-tabs-bar
    color orange
    margin-bottom: 1px;

  #questiondetails
    hidden

  .q-layout-drawer
    background-color: black;
    color: #999999;
</style>
