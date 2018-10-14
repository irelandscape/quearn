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
      <q-btn size="lg" @click="$router.go(-1)" >
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
        flat
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
      <q-btn
        class="q-mt-md q-mb-md"
        :label = "$t('answerthisquestion')"
        flat
        color = "secondary"
        @click = "editanswer=true"
        @editcompleted="onAnswerCompleted"
        v-if = "editanswer === false && notanswered"
      />
      <div v-if="editanswer">
        <h3 class="q-mt-sm q-mb-sm">{{$t('youranswer')}}:</h3>
        <transition
          appear
          enter-active-class="animated bounceInLeft"
          leave-active-class="animated bounceOutRight"
        >
          <editblog
            class="q-mt-md"
            :isquestion=false
            :question_title=this.blog.title
            :question_author=this.blog.author
            :question_permlink=this.blog.permlink
            :tags="tags"
            @editcompleted="onAnswerCompleted"
          />
        </transition>
      </div>

      <comments
        class="comments"
        v-if="showcomments"
        :parentAuthor=this.blog.author
        :parentPermlink=this.blog.permlink
      />
    </div>
    <answer v-for="(answer, index) in answers"
      class="blog answer shadow-1"
      :key="answer.id"
      :answer="answer"
      :opened="index === 0"
      :inheritAttrs=false
    />
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import Editblog from 'components/editblog'
import Answer from 'components/answer'
import Comments from 'components/comments'
import Writecomment from 'components/writecomment'
import axios from 'axios'
import { md2html } from 'components/utils/markdown'

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
      notanswered: true,
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
        return elem !== this.$store.getters['quearn/config'].tag
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
        return md2html(this.blog.body,
          this.$store.getters['quearn/xss'],
          this.$store.getters['quearn/config'].post_addon_msg)
      }
    },
    onAnswerCompleted: function (reload) {
      this.editanswer = false

      if (reload) {
        this.getAnswers()
      }
    },
    onCommentCompleted: function (context) {
      context.writecomment = false
    },
    showComments: function () {
      this.showcomments = !this.showcomments
    },
    getAnswers: function () {
      this.answers = []
      axios.get(
        this.$store.getters['quearn/serverURL'] + '/answers/',
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken'],
            question: this.question.id
          }
        }
      ).then((response) => {
        this.answers = response.data
        for (let answer of this.answers) {
          if (answer.author === this.$store.getters['steem/username']) {
            this.notanswered = false
            break
          }
        }
      }).catch((err) => {
        this.$q.notify({
          message: this.$tc('failedtogetanswers'),
          detail: err.error_description,
          type: 'negative'
        })
      })
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
    this.getAnswers()

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

  .q-toolbar
    position: fixed;
    top: 50px;
    z-index: 1;

  .q-toolbar-title
    white-space: normal

  .blog
    margin-top: 80px;

  .answer
    margin-top: 20px;

  .comments
    margin-left: -1rem;
</style>
