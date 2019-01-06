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
    blogBody: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      blog: null,
      question: null,
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
          this.$store.getters['quearn/removePatterns'])
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
    },
    getDiscussion: function (author, permlink) {
      if (this.blog) {
        return
      }
      let dsteem = this.$store.getters['steem/dsteem']
      dsteem.database.call('get_content',
        [author, permlink]
      ).then(response => {
        this.blog = response
      }).catch(function (err) {
        this.$q.notify({
          message: this.$tc('failedtogetquestions'),
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
    if (this.$route.params.blog) {
      this.blog = this.$route.params.blog
    }

    if (this.$route.params.id) {
      axios.get(
        this.$store.getters['quearn/serverURL'] +
          '/questions/?id=' + this.$route.params.id,
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((response) => {
        this.question = response.data[0]
        window.history.pushState(null, this.$store.getters['quearn/config'].appName, '/question/' + this.question.author + '/' + this.question.permlink)
        this.getDiscussion(this.question.author, this.question.permlink)
        this.getAnswers()
      }).catch(function (error) {
        console.log(error)
      })
    } else if (this.$route.params.question) {
      this.question = this.$route.params.question
      this.getDiscussion(this.question.author, this.question.permlink)
      this.getAnswers()
    } else if (this.$route.params.author && this.$route.params.permlink) {
      axios.get(
        this.$store.getters['quearn/serverURL'] +
          '/questions/?author=' + this.$route.params.author + '&permlink=' + this.$route.params.permlink,
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((response) => {
        this.question = response.data[0]
        this.getDiscussion(this.question.author, this.question.permlink)
        this.getAnswers()
      }).catch(function (error) {
        console.log(error)
      })
    } else {
      this.$router.push('/')
      return
    }

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
