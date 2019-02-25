<template>
  <div>
    <postheader
      :blog="blog"
    />

    <div v-if="blog">
      <div v-html="getBlogBody()" />
      <steemblogctrl
        :blog="blog"
        :condensed=false
        @showComments="showComments"
      />
    </div>
    <q-btn
      :label = "$t('writeacomment')"
      icon="add_comment"
      flat
      @click = "writecomment=!writecomment"
      v-if="!writecomment"
    />
    <writecomment
      :parentAuthor=blog.author
      :parentPermlink=blog.permlink
      v-if="writecomment"
      :callback="onCommentCompleted"
      :callbackContext=this
      :title="$tc('yourcomment')"
    />

    <comments
      class="comments"
      v-if="showcomments"
      :parentAuthor=this.blog.author
      :parentPermlink=this.blog.permlink
    />
  </div>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import Postheader from 'components/postheader'
import Writecomment from 'components/writecomment'
import Comments from 'components/comments'
import { md2html } from 'components/utils/markdown'

export default {
  name: 'Answer',
  components: {
    Steemblogctrl,
    Postheader,
    Comments,
    Writecomment
  },
  props: {
    answer: null,
    opened: false
  },
  data () {
    return {
      blog: null,
      writecomment: false,
      showcomments: false
    }
  },
  methods: {
    getBlogBody: function () {
      return md2html(this.blog.body,
        this.$store.getters['quearn/xss'],
        this.$store.getters['quearn/removePatterns'])
    },
    onCommentCompleted: function (context) {
      context.writecomment = false
    },
    showComments: function () {
      this.showcomments = !this.showcomments
    }
  },
  mounted () {
    let dsteem = this.$store.getters['steem/dsteem']
    dsteem.database.call('get_content',
      [this.answer.author, this.answer.permlink]
    ).then(response => {
      this.blog = response
    }).catch(function (err) {
      this.$q.notify({
        message: this.$tc('failedtogetanswerfromsteem'),
        detail: err.error_description,
        type: 'negative'
      })
    })
  }
}
</script>

<style lang="stylus">
  .q-collapsible-opened .q-item
    background-color: #eeeeee;

  .comments
    margin-left: -1rem;
</style>
