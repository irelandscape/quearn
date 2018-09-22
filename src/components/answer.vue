<template>
  <q-collapsible
    group="answers"
    :opened="opened"
  >
    <template slot="header">
      <q-item-main>
        <postheader
          :blog="blog"
        />
      </q-item-main>
    </template>

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
      v-if="showcomments"
      :parentAuthor=this.blog.author
      :parentPermlink=this.blog.permlink
    />

    <hr/>
  </q-collapsible>
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
      return md2html(this.blog.body, this.$store.getters['quearn/xss'])
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
</style>
