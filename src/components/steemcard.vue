<template>
  <div>
    <q-card
      v-bind:class="{ inlinecard: $q.platform.is.desktop }"
      color="white"
      class="q-pa-xs"
    >
      <div>
        <q-card-media overlay-position="bottom">
          <img :src="image" v-on:click="showquestion" />
        </q-card-media>
        <q-card-title>
          <span v-on:click="showquestion">{{title}}</span>
          <div slot="subtitle">
            <postheader
              :blog="blog"
              :topic="topic"
            />
          </div>
        </q-card-title>
      </div>
      <q-card-main class="tight">
        <steemblogctrl v-if="blog"
          :blog="blog"
          :question="question"
          :condensed=true
          :answer_count="question.answer_count"
        />
      </q-card-main>
      <q-inner-loading :visible="!blog">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script>

import Steemblogctrl from 'components/steemblogctrl'
import Postheader from 'components/postheader'

export default {
  name: 'Steemcard',
  components: {
    Steemblogctrl,
    Postheader
  },
  props: {
    question: Object
  },
  data: function () {
    return {
      blog: null,
      metadata: null,
      blog_html: ''
    }
  },
  computed: {
    image: function () {
      if (!this.blog) {
        return ''
      }
      if (this.metadata.image) {
        return this.metadata.image[0]
      } else {
        let images = this.blog.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
        if (images !== null && images.length > 0) {
          return images[0]
        } else {
          return '/assets/atom.jpg'
        }
      }
    },
    topic: function () {
      if (this.blog) {
        return this.metadata.tags[1]
      } else {
        return ''
      }
    },
    created: function () {
      if (this.blog) {
        return this.blog.created
      } else {
        return ''
      }
    },
    title: function () {
      if (this.blog) {
        return this.blog.title
      } else {
        return ''
      }
    },
    author: function () {
      if (this.blog) {
        return this.blog.author
      } else {
        return ''
      }
    }
  },
  methods: {
    avatar () {
      if (this.blog) {
        return 'https://steemitimages.com/u/' + this.blog.author + '/avatar'
      } else {
        return ''
      }
    },
    showquestion () {
      this.$router.push({
        name: 'question',
        params: {
          blog: this.blog,
          blogBody: this.blogBody,
          question: this.question
        }
      })
    }
  },
  created () {
    let dsteem = this.$store.getters['steem/dsteem']
    dsteem.database.call('get_content',
      [this.question.author, this.question.permlink]
    ).then(response => {
      this.blog = response
      this.metadata = JSON.parse(this.blog.json_metadata)
    }).catch((err) => {
      this.$q.notify({
        message: this.$tc('failedtogetquestions'),
        detail: err.error_description,
        type: 'negative'
      })
    })
  }
}
</script>

<style lang="stylus" scoped>

  >>> .q-card-media img
    height: 10rem;
    width: auto;
    margin: auto;
    cursor: pointer;

  >>> .q-card-title
    margin-top: 1rem;
    height: 4rem;
    line-height: 1rem;
    cursor: pointer;
    overflow: hidden;
    color: #333333;

  >>> .q-card-subtitle
    margin-top: 0.5rem;

  >>> .card h1, .card h2, .card h3, .card h4, .card h5
    font-size: 1rem;
    font-weight: bold;

  >>> .card img
    width: 0
    height: 0

  >>> .q-card-main .tight
    padding-top: 0

  >>> .q-card-container
    padding-top: 0
</style>
