<template>
  <div class="comments">
    <div
      v-for="blog in blogs"
      :key="blog.id"
    >
      <q-card class="q-mb-sm no-shadow">
        <q-card-title>
          <postheader
            :blog="blog"
            :fulldate=true
          />
        </q-card-title>
        <q-card-main>
            <div v-html="getBlogBody(blog)" />
            <steemcommentctrl
              :blog="blog"
              :parentAuthor="parentAuthor"
              :parentPermlink="parentPermlink"
              @show_comments="showComments"
            />
            <comments
              v-if="showcomments"
              :parentAuthor="blog.author"
              :parentPermlink="blog.permlink"
            />
            <q-btn
              :label = "$t('reply')"
              icon="add_comment"
              @click = "blog.writecomment=!blog.writecomment"
              v-if="!blog.writecomment"
            />
            <writecomment
              :parentAuthor="blog.author"
              :parentPermlink="blog.permlink"
              :callback="onCommentCompleted"
              :callbackContext="blog"
              v-if="blog.writecomment"
              :title="$tc('youranswer')"
            />
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>

import Postheader from 'components/postheader'
import Steemcommentctrl from 'components/steemcommentctrl'
import Writecomment from 'components/writecomment'

export default {
  name: 'comments',
  props: {
    parentAuthor: null,
    parentPermlink: null
  },
  data () {
    return {
      blogs: [],
      showcomments: false
    }
  },
  components: {
    Steemcommentctrl,
    Postheader,
    Writecomment
  },
  methods: {
    getBlogBody: function (blog) {
      let Remarkable = require('remarkable')
      let md = new Remarkable('full', {
        html: true,
        linkify: true
      })
      return md.render(blog.body)
    },
    showComments: function () {
      this.showcomments = !this.showcomments
    },
    onCommentCompleted: function (blog) {
      blog.writecomment = false
    },
    getComments: function () {
      let dsteem = this.$store.getters['steem/dsteem']
      dsteem.database.call('get_content_replies',
        [this.parentAuthor, this.parentPermlink]
      ).then(response => {
        for (let r of response) {
          r.writecomment = false
        }
        this.blogs = response
      }).catch(function (err) {
        this.$q.notify({
          message: this.$tc('failedtogetcomments'),
          detail: err.error_description,
          type: 'negative'
        })
      })
    }
  },
  mounted () {
    this.$root.$on('commentsuccess', function (caller, blog) {
      blog.writecomment = false
      this.getComments()
    })
    this.getComments()
  }
}
</script>

<style lang="stylus">
  .comments
    margin: 1rem;

  .q-card
    border: 1px solid lightgrey

  div.author
    line-height: 0rem;
</style>
