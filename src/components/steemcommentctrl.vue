<template>
  <div>
    <q-btn-group>
      <steemvote
        :blog='blog'
      />
      <q-btn
        v-if="isAuthor()"
        icon="edit"
        size="xs"
        @click="startEdit()">
        <q-tooltip>Edit</q-tooltip>
      </q-btn>
      <q-btn
        v-if="blog.children"
        icon="comment"
        size="xs"
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
    parentPermlink: ''
  },
  methods: {
    startEdit: function () {
      this.$root.$emit('edit_post',
        this.blog, {
          iscomment: true,
          parentAuthor: this.parentAuthor,
          parentPermlink: this.parentPermlink
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
