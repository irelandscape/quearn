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
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
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
