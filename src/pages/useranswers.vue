<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
      <q-toolbar-title>
        {{ $t('myanswers') }}
      </q-toolbar-title>
      <q-btn size="lg" @click="$router.go(-1)" >
        <q-icon name="close" outlined>
          <q-tooltip>Back</q-tooltip>
        </q-icon>
      </q-btn>
    </q-toolbar>

    <div v-for="answer in answers"
      :key="answer.id"
      class="blog shadow-1"
    >
      <q-chip
        v-for="tag in tags(answer)"
        :key="tag"
        square color="secondary"
        dense>
        {{tag}}
      </q-chip>
      <div>
        <div class="timestamp">
          {{answer.created | timestamp}}
          (<timeago :datetime="answer.created" :auto-update="60"></timeago>)
        </div>
        <div v-if="answer.blog"
          v-on:click="showanswer(answer.blog)">
          <h2>{{answer.title}}</h2>
          <div style="text-align: center;">
            <img v-if="answer.blog" :src="image(answer.blog)" />
          </div>
        </div>
        <div v-if="answer.blog"
          class="blogsummary"
          v-html="getBlogBody(answer.blog)"
        />
        <steemblogctrl v-if="answer.blog"
          :blog="answer.blog"
          :condensed=false
        />
        <q-spinner-gears v-else />
      </div>
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import axios from 'axios'
import { md2html } from 'components/utils/markdown'

export default {
  name: 'Useranswers',
  components: {
    Steemblogctrl
  },
  data: function () {
    return {
      answers: []
    }
  },
  methods: {
    showanswer (blog) {
      this.$router.push({
        name: 'answer',
        params: {
          blog: blog,
          blogBody: this.getBlogBody(blog)
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
          return '/statics/atom.jpg'
        }
      }
    },
    tags (answer) {
      let t = []

      if (answer.tag1 !== this.$store.getters['quearn/config'].tag) {
        t.push(answer.tag1)
      } else if (answer.tag2 !== this.$store.getters['quearn/config'].tag) {
        t.push(answer.tag2)
      } else if (answer.tag3 !== this.$store.getters['quearn/config'].tag) {
        t.push(answer.tag3)
      } else if (answer.tag4 !== this.$store.getters['quearn/config'].tag) {
        t.push(answer.tag4)
      } else if (answer.tag5 !== this.$store.getters['quearn/config'].tag) {
        t.push(answer.tag5)
      }

      return t
    },
    getAnswerFromSteem (answer) {
      let dsteem = this.$store.getters['steem/dsteem']
      dsteem.database.call('get_content',
        [answer.author, answer.permlink]
      ).then(response => {
        answer.blog = response
        // replace the whole array because vue cannot detect change in
        // array
        this.answers = [...this.answers]
      }).catch(function (error) {
        console.log(error)
      })
    },
    getBlogBody: function (blog) {
      return md2html(blog.body,
        this.$store.getters['quearn/xss'],
        this.$store.getters['quearn/removePatterns'])
    }
  },
  mounted () {
    let user

    if (this.user) {
      user = this.user
    } else {
      user = this.$store.getters['steem/username']
    }
    axios.get(
      this.$store.getters['quearn/serverURL'] + '/answers/?author=' + encodeURIComponent(user) + '&ordering=-created',
      {
        params: {
          username: this.$store.getters['steem/username'],
          access_token: this.$store.getters['steem/accessToken']
        }
      }
    ).then((answers) => {
      for (let answer of answers.data) {
        this.getAnswerFromSteem(answer)
        this.answers.push(answer)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

  .q-toolbar-title
    white-space: normal;

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

  .q-toolbar
    z-index: 1;

  .blog
    margin-top: 80px;
</style>
