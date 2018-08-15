<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
        <q-toolbar-title>
          {{blog.title}}
            <div slot="subtitle">by {{ blog.author }}</div>
        </q-toolbar-title>
        <q-btn
          size="lg"
          to="/"
        >
          <q-icon name="close" outlined>
            <q-tooltip>Back</q-tooltip>
          </q-icon>
        </q-btn>
    </q-toolbar>
    <div class="blog">
      <div v-html="getBlogBody()" />
      <steemblogctrl :blog="blog" />
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'

export default {
  name: 'PageQuestion',
  components: {
    Steemblogctrl
  },
  props: {
    blog: Object,
    blogBody: {
      type: String,
      default: null
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getBlogBody: function () {
      if (this.blogBody) {
        return this.blogBody
      } else {
        let Remarkable = require('remarkable')
        let md = new Remarkable({
          html: true,
          linkify: true
        })
        return md.render(this.blog.body)
      }
    }
  },
  mounted () {
    if (!this.blog) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"
</style>
