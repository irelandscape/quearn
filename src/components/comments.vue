<template>
  <div class="comments">
    <div
      v-for="blog in blogs"
      :key="blog.id"
      class="q-ml-lg"
    >
      <q-card class="q-mb-sm no-shadow">
        <q-card-title>
          <postheader
            :blog="blog"
            :fulldate=true
            class="smaller"
          />
        </q-card-title>
        <q-card-main>
          <div v-html="getBlogBody(blog)" />
          <q-btn
            :label = "$t('reply')"
            flat
            size="sm"
            @click = "blog.writecomment=!blog.writecomment"
            v-if="!blog.writecomment"
          />
          <steemcommentctrl
            :blog="blog"
            :parentAuthor="parentAuthor"
            :parentPermlink="parentPermlink"
            @show_comments="showComments"
          />
          <writecomment
            :parentAuthor="blog.author"
            :parentPermlink="blog.permlink"
            :callback="onCommentCompleted"
            :callbackContext="blog"
            v-if="blog.writecomment"
            :title="$tc('youranswer')"
          />
          <comments
            v-if="showcomments"
            :parentAuthor="blog.author"
            :parentPermlink="blog.permlink"
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
import { md2html } from 'components/utils/markdown'

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
      return md2html(blog.body, this.$store.getters['quearn/xss'])
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
  @import '~variables'

  .comments
    margin-left: 1rem;
    color: rgba(0, 0, 0, 0.7);

  div.author
    line-height: 0rem;

  .smaller
    font-size: 80%;
    line-height: 0.7rem;
</style>
