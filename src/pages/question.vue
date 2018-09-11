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
        :label = "$t('answerthisquestion')"
        color = "secondary"
        @click = "editanswer=true"
        v-if = "editanswer === false"
      />
      <div v-if="editanswer">
        <h3>{{$t('youranswer')}}:</h3>
        <editblog
          class="q-mt-md"
          :isquestion=false
          :question_title=this.blog.title
          :question_author=this.blog.author
          :question_permlink=this.blog.permlink
          :tags="tags"
          @editcompleted="onAnswerCompleted"
        />
      </div>

      <comments
        v-if="showcomments"
        :parentAuthor=this.blog.author
        :parentPermlink=this.blog.permlink
      />

      <q-list>
        <answer v-for="(answer, index) in answers"
          :key="answer.id"
          :answer="answer"
          :opened="index === 0"
        />
      </q-list>
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import Editblog from 'components/editblog'
import Answer from 'components/answer'
import Comments from 'components/comments'
import axios from 'axios'

export default {
  name: 'PageQuestion',
  components: {
    Steemblogctrl,
    Editblog,
    Answer,
    Comments
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
      editanswer: false,
      answers: [],
      showcomments: false
    }
  },
  computed: {
    tags: function () {
      let tags = JSON.parse(this.blog.json_metadata).tags
      return tags.filter((elem) => {
        return elem !== this.$store.getters['steemqa/config'].tag
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
        let Remarkable = require('remarkable')
        let md = new Remarkable('full', {
          html: true,
          linkify: true
        })
        return md.render(this.blog.body)
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
    this.$root.$on('show_comments', () => {
      this.showcomments = !this.showcomments
    })

    if (!this.blog) {
      this.$router.push('/')
      return
    }

    /* Get answers */
    axios.get(
      this.$store.getters['steemqa/serverURL'] + '/answers/',
      {
        params: {
          username: this.$store.getters['steem/username'],
          access_token: this.$store.getters['steem/accessToken'],
          question_author: this.blog.author,
          question_permlink: this.blog.permlink
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
    margin: auto;
    max-width: 750px;
</style>
