<template>
  <div class="steemblogctrl">
    <div class="row">
      <div class="col-8">
        <steemvote
          :blog='blog'
          v-if="this.$store.getters['steem/loggedIn']"
        />
        <q-btn
          v-if="question"
          icon="question_answer"
          flat
          dense
          title="answers"
          :label="answer_count"
          no-wrap
        >
          <q-tooltip>Answers</q-tooltip>
        </q-btn>
        <q-btn
          v-if="this.$store.getters['steem/loggedIn']"
          icon="subdirectory_arrow_right"
          flat
          dense
          no-wrap
        >
          <q-tooltip>Resteem</q-tooltip>
        </q-btn>
        <q-btn
          icon="more_horiz"
          flat
          dense
          no-wrap
        >
          <q-tooltip>More</q-tooltip>
          <q-popover>
              <q-btn-group flat>
                <q-btn
                  icon="keyboard_arrow_up"
                  flat
                  title="upvotes"
                  no-wrap
                >
                  {{blog.active_votes.length}}
                </q-btn>
                <q-btn
                  v-if="this.$store.getters['steem/loggedIn'] && !condensed"
                  icon="edit"
                  flat
                  no-wrap
                  @click="startEdit()">
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="question && this.$store.getters['steem/loggedIn']"
                  icon="bookmark"
                  flat
                  title="bookmark"
                  no-wrap
                  :color="bookmarkcolor"
                  @click="toggleBookmark()"
                />
                <q-btn
                  v-if="this.$store.getters['steem/loggedIn']"
                  icon="comment"
                  flat
                  no-wrap
                  title="comments"
                  :label="blog.children"
                  @click="showComments()"
                />
              </q-btn-group>
          </q-popover>
        </q-btn>
      </div>
      <div class="col-4 right">
        <q-btn
          icon="attach_money"
          :label="blog.pending_payout_value | sbd"
          flat
          class="tight"
          no-wrap
        >
          <q-tooltip>Estimated payout</q-tooltip>
        </q-btn>
      </div>
    </div>
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

  .q-btn
    color: #666666;

  >>> .tight .on-left
    margin-right: 0;

  >>> .right
    text-align: right;

</style>
