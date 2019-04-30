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
      <hr/>
      <q-btn
        class="q-mt-md q-mb-md"
        :label = "$t('gotoquestion')"
        color = "secondary"
        @click = "goToQuestion()"
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
      <comments
        class="comments"
        v-if="showcomments"
        :parentAuthor=this.blog.author
        :parentPermlink=this.blog.permlink
      />
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import Editblog from 'components/editblog'
import Answer from 'components/answer'
import Writecomment from 'components/writecomment'
import axios from 'axios'
import Comments from 'components/comments'
import { md2html } from 'components/utils/markdown'

export default {
  name: 'PageAnswer',
  components: {
    Steemblogctrl,
    Editblog,
    Comments,
    Writecomment,
    Answer
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
      editanswer: false,
      writecomment: false,
      showcomments: false
    }
  },
  computed: {
    description: function () {
      if (this.blog) {
        return 'Answer by @' + this.blog.author
      }
    },
    title: function () {
      if (this.blog) {
        return this.blog.title.replace(/^A *- */g, '')
      }
    },
    image: function () {
      if (!this.blog) {
        return ''
      }
      if (this.metadata && this.metadata.image) {
        return this.metadata.image[0]
      } else {
        let images = this.blog.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
        if (images !== null && images.length > 0) {
          return 'https://steemitimages.com/0x0/' + images[0]
        } else {
          return '/assets/atom.jpg'
        }
      }
    },
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
    onCommentCompleted: function (context) {
      context.writecomment = false
    },
    showComments: function () {
      this.showcomments = !this.showcomments
    },
    onAnswerCompleted: function () {
      this.editanswer = false
    },
    goToQuestion: function () {
      this.$router.push({
        name: 'question',
        params: {
          id: this.answer.question
        }
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
  meta () {
    return {
      meta: [
        {
          property: 'og:site_name',
          content: this.$store.getters['quearn/config'].site_name.length ? this.$store.getters['quearn/config'].site_name : ''
        },
        {
          property: 'og:url',
          content: window.location.href
        },
        {
          property: 'og:image',
          content: this.image
        },
        {
          property: 'og:title',
          content: this.title
        },
        {
          property: 'og:description',
          content: this.description
        }
      ]
    }
  },
  mounted () {
    if (this.$route.params.blog) {
      this.blog = this.$route.params.blog
    }

    if (this.$route.params.id) {
      axios.get(
        this.$store.getters['quearn/serverURL'] +
          '/answers/?id=' + this.$route.params.id,
        {
          params: {
          }
        }
      ).then((response) => {
        this.answer = response.data[0]
        window.history.pushState(null, this.$store.getters['quearn/config'].appName, '/answer/' + this.answer.author + '/' + this.answer.permlink)
        this.getDiscussion(this.answer.author, this.answer.permlink)
      }).catch(function (error) {
        console.log(error)
      })
    } else if (this.$route.params.author && this.$route.params.permlink) {
      axios.get(
        this.$store.getters['quearn/serverURL'] +
          '/answers/?author=' + this.$route.params.author + '&permlink=' + this.$route.params.permlink,
        {
          params: {
          }
        }
      ).then((response) => {
        this.answer = response.data[0]
        this.getDiscussion(this.answer.author, this.answer.permlink)
      }).catch(function (error) {
        console.log(error)
      })
    } else if (this.$route.params.answer) {
      this.answer = this.$route.params.answer
      this.getDiscussion(this.answer.author, this.answer.permlink)
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
    white-space: normal;

  .blog
    margin-top: 80px;
</style>
