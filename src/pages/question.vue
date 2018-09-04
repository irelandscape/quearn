<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
        <q-toolbar-title v-if="blog">
          {{blog.title}}
            <div slot="subtitle">by {{ blog.author }}
              <div>
                <q-chip
                  v-for="tag in tags"
                  :key="tag"
                  square color="secondary"
                  dense>
                  {{tag}}
                </q-chip>
              </div>
            </div>
        </q-toolbar-title>
        <q-btn size="lg" to="/" >
          <q-icon name="close" outlined>
            <q-tooltip>Back</q-tooltip>
          </q-icon>
        </q-btn>
    </q-toolbar>
    <div v-if="blog" class="blog">
      <div v-html="getBlogBody()" />
      <steemblogctrl
        :blog="blog"
        :condensed=false
      />
      <hr/>
      <q-btn
        class="q-mt-md q-mb-md"
        :label = "$t('answerthisquestion')"
        color = "secondary"
        @click = "editanswer=true"
        v-if = "editanswer === false"
      />
      <editanswer
        v-if="editanswer"
        class="q-mt-md"
        :tags="tags"
      />
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import Editanswer from 'components/editanswer'

export default {
  name: 'PageQuestion',
  components: {
    Steemblogctrl,
    Editanswer
  },
  props: {
    blog: null,
    blogBody: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      editanswer: false
    }
  },
  methods: {
    getBlogBody: function () {
      if (this.blogBody) {
        return this.blogBody
      } else {
        let Remarkable = require('remarkable')
        let md = new Remarkable('full', {
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
  },
  computed: {
    tags: function () {
      let tags = JSON.parse(this.blog.json_metadata).tags
      return tags.filter((elem) => {
        return elem !== this.$store.getters['steemqa/config'].tag
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

  .q-chip
    margin-top: 0.5rem;
    margin-right: 0.5rem;

  .q-toolbar-title
    margin: auto;
    max-width: 750px;
</style>
