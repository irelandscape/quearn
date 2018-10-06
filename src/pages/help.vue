<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
      <q-toolbar-title>
        {{ $tc('help') }}
      </q-toolbar-title>
      <q-btn size="lg" @click="$router.go(-1)" >
        <q-icon name="close" outlined>
          <q-tooltip>Back</q-tooltip>
        </q-icon>
      </q-btn>
    </q-toolbar>

    <div class="blog shadow-1" v-if="body" v-html="body">
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { md2html } from 'components/utils/markdown'

export default {
  name: 'PageHelp',
  data () {
    return {
      body: null
    }
  },
  components: {
  },
  mounted: function () {
    axios.get(
      this.$store.getters['quearn/serverURL'] + '/help/',
      {
        params: {
          lang: this.$q.i18n.lang
        }
      }
    ).then((response) => {
      this.body = md2html(response.data[0].markdown, this.$store.getters['quearn/xss'])
    }).catch((err) => {
      this.$q.notify({
        message: this.$tc('error'),
        detail: err.error_description,
        type: 'negative'
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

</style>
