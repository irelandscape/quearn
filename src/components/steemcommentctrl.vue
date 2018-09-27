<template>
  <div>
    <q-btn-group flat>
      <steemvote
        :blog='blog'
      />
      <q-btn
        v-if="isAuthor()"
        icon="edit"
        flat
        size="sm"
        @click="startEdit()">
        <q-tooltip>Edit</q-tooltip>
      </q-btn>
      <q-btn
        v-if="blog.children"
        icon="comment"
        flat
        size="sm"
        title="comments"
        :label="blog.children"
        @click="showComments()"
      />
    </q-btn-group>
  </div>
</template>

<script>
import Steemvote from 'components/steemvote'

export default {
  name: 'Steemcommentctrl',
  components: {
    Steemvote
  },
  props: {
    blog: null,
    parentAuthor: '',
    parentPermlink: '',
    caller: null
  },
  methods: {
    startEdit: function () {
      this.$root.$emit('edit_post',
        this.blog, {
          iscomment: true,
          parentAuthor: this.parentAuthor,
          parentPermlink: this.parentPermlink,
          caller: this.caller
        })
    },
    isAuthor: function () {
      return this.blog.author === this.$store.getters['steem/username']
    },
    showComments: function () {
      this.$emit('show_comments')
    }
  }
}
</script>
