<template>
  <q-page>
    <q-layout-header>
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
    </q-layout-header>
    <div v-if="blog"
     class="blog shadow-1"
    >
      <div v-html="getBlogBody()" />
      <steemblogctrl
        :blog="blog"
        :condensed=false
      />
      <hr/>
      <q-btn
        class="q-mt-md q-mb-md"
        :label = "$t('answerthisanswer')"
        color = "secondary"
        @click = "editanswer=true"
        v-if = "editanswer === false"
      />
      <div v-if="editanswer">
        <h3>{{$t('youranswer')}}:</h3>
        <editblog
          class="q-mt-md"
          :isanswer=false
          :answer_title=this.blog.title
          :answer_author=this.blog.author
          :answer_permlink=this.blog.permlink
          :tags="tags"
          @editcompleted="onAnswerCompleted"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import Editblog from 'components/editblog'
import Answer from 'components/answer'
import axios from 'axios'
import { md2html } from 'components/utils/markdown'

export default {
  name: 'PageAnswer',
  components: {
    Steemblogctrl,
    Editblog,
    Answer
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
  computed: {
    tags: function () {
      let tags = JSON.parse(this.blog.json_metadata).tags
      return tags.filter((elem) => {
        return elem !== this.$store.getters['quearn/config'].tag
      })
    }
  },
  methods: {
    isFirst: function (index) {
      console.log(index)
      return index === 0
    },
    getBlogBody: function () {
      if (this.blogBody) {
        return this.blogBody
      } else {
        return md2html(this.blog.body, this.$store.getters['quearn/xss'])
      }
    },
    onAnswerCompleted: function () {
      this.editanswer = false
    }
  },
  watch: {
    blog: function () {
    }
  },
  mounted () {
    if (!this.blog) {
      this.$router.push('/')
      return
    }

    /* Get answers */
    axios.get(
      this.$store.getters['quearn/serverURL'] + '/answers/',
      {
        params: {
          username: this.$store.getters['steem/username'],
          access_token: this.$store.getters['steem/accessToken'],
          answer_author: this.blog.author,
          answer_permlink: this.blog.permlink
        }
      }
    ).then((response) => {
      this.answers = response.data
    }).catch((err) => {
      this.$q.notify({
        message: this.$tc('failedtogetanswers'),
        detail: err.error_description,
        type: 'negative'
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

  .q-list
    padding: 0

  .q-chip
    margin-top: 0.5rem;
    margin-right: 0.5rem;

  .q-toolbar-title
    white-space: normal;
</style>
