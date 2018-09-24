<template>
  <div class="steemblogctrl">
    <div>
      <q-btn
        icon="attach_money"
        :label="blog.pending_payout_value | sbd"
        flat size="md"
        class="tight"
      />
      <q-btn icon="keyboard_arrow_up" flat size="md" title="upvotes">
        {{blog.active_votes.length}}
      </q-btn>
    </div>
    <steemvote
      :blog='blog'
      v-if="this.$store.getters['steem/loggedIn']"
    />
    <q-btn
      v-if="this.$store.getters['steem/loggedIn']"
      icon="subdirectory_arrow_right" size="xs"
    >
      <q-tooltip>Resteem</q-tooltip>
    </q-btn>
    <q-btn
      v-if="this.$store.getters['steem/loggedIn'] && !condensed"
      icon="edit"
      size="xs"
      @click="startEdit()">
      <q-tooltip>Edit</q-tooltip>
    </q-btn>
    <q-btn
      v-if="question"
      icon="question_answer"
      size="xs"
      title="answers"
      :label="answer_count"
    />
    <q-btn
      v-if="question && this.$store.getters['steem/loggedIn']"
      icon="bookmark"
      size="xs"
      title="bookmark"
      :color="bookmarkcolor"
      @click="toggleBookmark()"
    />
    <q-btn
      v-if="this.$store.getters['steem/loggedIn']"
      icon="comment"
      size="xs"
      title="comments"
      :label="blog.children"
      @click="showComments()"
    />
  </div>
</template>

<script>
import Steemvote from 'components/steemvote'

export default {
  name: 'Steemblogctrl',
  components: {
    Steemvote
  },
  props: {
    blog: null,
    condensed: false,
    answer_count: null,
    question: null
  },
  methods: {
    startEdit: function () {
      this.$root.$emit('edit_post', this.blog)
    },
    showComments: function () {
      this.$emit('showComments')
    },
    toggleBookmark: function () {
      let bookmark = this.$store.getters['quearn/bookmark'](this.question.id)
      if (bookmark) {
        this.$store.dispatch('quearn/removeBookmark', {
          vue: this,
          bookmark,
          username: this.$store.getters['steem/username'],
          accessToken: this.$store.getters['steem/accessToken']
        })
      } else {
        this.$store.dispatch('quearn/addBookmark', {
          vue: this,
          question: this.question,
          username: this.$store.getters['steem/username'],
          accessToken: this.$store.getters['steem/accessToken']
        })
      }
    }
  },
  computed: {
    bookmarkcolor () {
      if (this.$store.getters['quearn/bookmark'](this.question.id)) {
        return 'secondary'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .steemblogctrl
    color: #999999;
    height: 5rem;

  .q-btn
    color: #666666;
    margin-right: 0.2rem;
    padding-top: 0;
    padding-bottom: 0;

  >>> .tight .on-left
    margin-right: 0;

</style>
