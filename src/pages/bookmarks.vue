<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
      <q-toolbar-title>
        {{ $t('mybookmarks') }}
      </q-toolbar-title>
      <q-btn size="lg" to="/" >
        <q-icon name="close" outlined>
          <q-tooltip>Back</q-tooltip>
        </q-icon>
      </q-btn>
    </q-toolbar>

    <div v-for="question in questions"
      :key="question.id"
      class="blog shadow-1"
    >
      <q-chip
        v-for="tag in tags(question)"
        :key="tag"
        square color="secondary"
        dense>
        {{tag}}
      </q-chip>
      <div>
        <div class="timestamp">
          {{question.created | timestamp}}
          (<timeago :datetime="question.created" :auto-update="60"></timeago>)
        </div>
        <div v-if="question.blog"
          v-on:click="showquestion(question.blog, question)">
          <h2>{{question.title}}</h2>
          <div style="text-align: center;">
            <img v-if="question.blog" :src="image(question.blog)" />
          </div>
        </div>
        <div v-if="question.blog"
          class="blogsummary"
          v-html="getBlogBody(question.blog)"
        />
        <steemblogctrl v-if="question.blog"
          :blog="question.blog"
          :condensed=true
          :answer_count="question.answer_count"
          :question="question"
          @showComments="showComments"
        />
        <q-spinner-gears v-else />

        <comments
          v-if="showcomments"
          :parentAuthor="question.blog.author"
          :parentPermlink="question.blog.permlink"
        />

      </div>
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import axios from 'axios'
import sortedIndexBy from 'lodash'
import Comments from 'components/comments'

export default {
  name: 'Userquestions',
  components: {
    Steemblogctrl,
    Comments
  },
  data: function () {
    return {
      questions: [],
      showcomments: false
    }
  },
  methods: {
    showComments: function () {
      this.showcomments = !this.showcomments
    },
    showquestion (blog, question) {
      this.$router.push({
        name: 'question',
        params: {
          blog: blog,
          blogBody: this.getBlogBody(blog),
          question
        }
      })
    },
    image: function (blog) {
      let metadata = JSON.parse(blog.json_metadata)
      if (metadata.image) {
        return metadata.image[0]
      } else {
        let images = blog.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
        if (images !== null && images.length > 0) {
          return images[0]
        } else {
          return '/assets/atom.jpg'
        }
      }
    },
    tags (question) {
      let t = []

      if (question.tag1 !== this.$store.getters['steemqa/config'].tag) {
        t.push(question.tag1)
      } else if (question.tag2 !== this.$store.getters['steemqa/config'].tag) {
        t.push(question.tag2)
      } else if (question.tag3 !== this.$store.getters['steemqa/config'].tag) {
        t.push(question.tag3)
      } else if (question.tag4 !== this.$store.getters['steemqa/config'].tag) {
        t.push(question.tag4)
      } else if (question.tag5 !== this.$store.getters['steemqa/config'].tag) {
        t.push(question.tag5)
      }

      return t
    },
    getQuestionFromSteem (question) {
      let dsteem = this.$store.getters['steem/dsteem']
      dsteem.database.call('get_content',
        [question.author, question.permlink]
      ).then(response => {
        question.blog = response
        // replace the whole array because vue cannot detect change in
        // array
        this.questions = [...this.questions]
      }).catch(function (error) {
        console.log(error)
      })
    },
    getBlogBody: function (blog) {
      let Remarkable = require('remarkable')
      let md = new Remarkable('full', {
        html: true,
        linkify: true
      })
      return md.render(blog.body)
    }
  },
  mounted () {
    for (let questionId in this.$store.getters['steemqa/bookmarksByQuestion']) {
      let bookmark = this.$store.getters['steemqa/bookmarksByQuestion'][questionId]
      axios.get(
        this.$store.getters['steemqa/serverURL'] + '/questions/' + bookmark.question + '/',
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((question) => {
        this.getQuestionFromSteem(question.data)
        this.questions.splice(sortedIndexBy(this.questions,
          question.data,
          function (o) { return new Date(o.created) }
        ),
        0,
        question.data)
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

  .timestamp
    margin-top: 0.5rem;
    color: grey;
    font-size: 0.8rem;

  time
    margin-top: 1rem;

  h2
    margin: 0
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

  img
    max-height: 20rem;
    margin: auto;
</style>
