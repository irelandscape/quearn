<template>
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
        <q-chip v-if="topic" small square color="secondary" dense class="float-right">
          {{topic}}
        </q-chip>
        <span v-on:click="showquestion">{{title}}</span>
        <postheader slot="subtitle"
          :blog="blog"
        />
      </q-card-title>
    </div>
    <q-card-main class="tight">
      <steemblogctrl v-if="blog"
        class="q-mb-sm"
        :blog="blog"
        :question="discussion"
        :condensed=true
        :answer_count="discussion.answer_count"
      />
    </q-card-main>
  </q-card>
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
    discussion: Object
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
      if (this.metadata && this.metadata.image) {
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
      if (this.discussion) {
        return this.$store.getters['quearn/topicStr'](this.discussion.topic)
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
    showquestion () {
      this.$router.push({
        name: 'question',
        params: {
          author: this.discussion.author,
          permlink: this.discussion.permlink,
          blog: this.blog,
          blogBody: this.blogBody,
          question: this.discussion
        }
      })
    }
  },
  created () {
    let dsteem = this.$store.getters['steem/dsteem']
    dsteem.database.call('get_content',
      [this.discussion.author, this.discussion.permlink]
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
    font-weight: bold;
    font-size: 0.8rem;
    height: 4rem;
    line-height: 1rem;
    cursor: pointer;
    overflow: hidden;
    color: #333333;

  >>> .q-card-subtitle
    margin-top: 0.5rem;
    height: 2.5rem;

  >>> .card h1, .card h2, .card h3, .card h4, .card h5
    font-size: 1rem;
    font-weight: bold;

  >>> .card img
    width: 0
    height: 0

  >>> .q-card-main .tight
    padding: 0

  >>> .q-card-container
    padding-top: 0
    padding-bottom: 0

  >>> .q-chip-main
    max-width: 5rem;
    white-space: normal;

</style>
