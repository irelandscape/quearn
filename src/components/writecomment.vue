<template>
  <div class="comment"
    v-html="compiledMarkdown"
  />
</template>

<script>
import { md2html } from 'components/utils/markdown'

export default {
  name: 'Writecomment',
  props: {
    blog: {
      type: Object,
      default: function () {
        return {
          body: '',
          permlink: Math.random().toString(36).substring(2)
        }
      }
    },
    parentAuthor: '',
    parentPermlink: '',
    callback: null,
    callbackContext: null,
    title: ''
  },
  computed: {
    compiledMarkdown: function () {
      return md2html(this.blog.body, this.$store.getters['steemqa/xss'])
    }
  },
  mounted () {
    this.$root.$emit('edit_post',
      this.blog, {
        callback: this.callback,
        callbackContext: this.callbackContext,
        iscomment: true,
        parentAuthor: this.parentAuthor,
        parentPermlink: this.parentPermlink,
        title: this.title
      })
  }
}
</script>

<style lang="stylus" scoped>
  .comment
    min-height: 5rem;
    border: 1px solid lightgrey;
    padding: 0.5rem;
    margin-top: 1rem;
</style>
