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
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="whatshot" />
          <q-item-main label="Top Questions" />
        </q-item>
        <q-item @click.native="openURL('https://github.com/quasarframework/')">
          <q-item-side icon="access_time" />
          <q-item-main label="Recent Questions" />
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
      let config = this.$store.getters['steemqa/config']

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
  .q-tabs-bar
    color orange
    margin-bottom: 1px;

  #questiondetails
    hidden
</style>
