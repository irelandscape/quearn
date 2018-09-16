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
        :question="question"
        @showComments="showComments"
      />
      <q-btn
        :label = "$t('writeacomment')"
        icon="add_comment"
        @click = "writecomment=!writecomment"
        v-if="!writecomment"
      />
      <writecomment
        :parentAuthor=this.blog.author
        :parentPermlink=this.blog.permlink
        v-if="writecomment"
        :callback="onCommentCompleted"
        :callbackContext=this
        :title="$tc('yourcomment')"
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
          :inheritAttrs=false
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
import Writecomment from 'components/writecomment'
import axios from 'axios'

export default {
  name: 'PageQuestion',
  components: {
    Steemblogctrl,
    Editblog,
    Answer,
    Comments,
    Writecomment
  },
  props: {
    blog: null,
    question: null,
    blogBody: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      editanswer: false,
      writecomment: false,
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
    },
    onCommentCompleted: function (context) {
      context.writecomment = false
    },
    showComments: function () {
      this.showcomments = !this.showcomments
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

    this.$root.$on('commentsuccess', function (caller, blog) {
      if (caller) {
        caller.writecomment = false
      }
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
