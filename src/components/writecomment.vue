<template>
  <div class="comment"
    v-html="compiledMarkdown"
  />
</template>

<script>
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
      let Remarkable = require('remarkable')
      let md = new Remarkable({
        html: true,
        linkify: true
      })
      return md.render(this.blog.body)
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
