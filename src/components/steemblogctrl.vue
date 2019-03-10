<template>
  <div class="steemblogctrl">
    <div class="row">
      <div class="col-9">
        <steemvote
          :blog='blog'
          v-if="this.$store.getters['steem/loggedIn']"
        />
        <q-btn
          v-if="question"
          icon="rate_review"
          flat
          dense
          title="$tc('answers')"
          :label="answer_count ? answer_count.toString() : '0'"
          no-wrap
        >
          <q-tooltip>{{$tc('answers')}}</q-tooltip>
        </q-btn>
        <q-btn
          icon="comment"
          flat
          dense
          no-wrap
          title="comments"
          :label="blog.children ? blog.children.toString() : '0'"
          @click="showComments()"
        >
          <q-tooltip>{{$tc('comments')}}</q-tooltip>
        </q-btn>
        <q-btn
          icon="more_horiz"
          flat
          dense
          no-wrap
        >
          <q-tooltip>{{$tc('more')}}</q-tooltip>
          <q-popover>
              <q-btn-group flat>
                <q-btn
                  icon="keyboard_arrow_up"
                  flat
                  :title="$tc('upvote', 2)"
                  no-wrap
                >
                  {{blog.active_votes.length}}
                  <q-tooltip>
                    <div v-for="vote in blog.active_votes.slice(0, 40)" :key="vote.voter">
                      <span>{{vote.voter}}:&nbsp;</span>
                      <span>{{vote.percent / 100}}&#37;</span>
                      &nbsp;(<timeago :datetime="vote.time" :auto-update="1"></timeago>)
                    </div>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  v-if="this.$store.getters['steem/loggedIn']"
                  icon="subdirectory_arrow_right"
                  flat
                  dense
                  no-wrap
                  @click="resteem()"
                >
                  <q-tooltip>{{$tc('resteem')}}</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="this.isAuthor() && !condensed"
                  icon="edit"
                  flat
                  no-wrap
                  @click="startEdit()">
                  <q-tooltip>{{$tc('edit')}}</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="question && this.$store.getters['steem/loggedIn']"
                  icon="bookmark"
                  flat
                  :title="$tc('bookmark')"
                  no-wrap
                  :color="bookmarkcolor"
                  @click="toggleBookmark()"
                />
              </q-btn-group>
          </q-popover>
        </q-btn>
      </div>
      <div class="col-3 right">
        <q-btn
          icon="attach_money"
          :label="getPayout"
          flat
          class="tight"
          no-wrap
        >
          <q-tooltip>{{$tc('estimatedpayout')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Steemvote from 'components/steemvote'
import { payout, decryptAuthDetails } from 'components/utils/steem'
import { PrivateKey } from 'dsteem'

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
    resteem: function () {
      this.$root.$emit('confirm_dialog',
        this.$tc('resteem'),
        this.$tc('confirmresteem'),
        () => {
          this.$q.loading.show({
            message: this.$tc('resteeming')
          })
          decryptAuthDetails(this.$store.getters['steem/authDetails'])
            .then((authDetails) => {
              const jsonOp = JSON.stringify([
                'reblog',
                {
                  account: this.$store.getters['steem/username'],
                  author: this.blog.author,
                  permlink: this.blog.permlink
                }
              ])
              const data = {
                id: 'follow',
                json: jsonOp,
                required_auths: [],
                required_posting_auths: [this.$store.getters['steem/username']]
              }

              this.$store.getters['steem/dsteem'].broadcast.json(data,
                PrivateKey.fromString(authDetails.steemPostingKey))
                .then(() => {
                  this.$q.loading.hide()
                  this.$q.notify({
                    message: this.$tc('resteemsuccess'),
                    type: 'positive'
                  })
                }).catch((err) => {
                  this.$q.loading.hide()
                  this.$q.notify({
                    message: this.$tc('resteemfailed'),
                    detail: err.error_description,
                    type: 'negative'
                  })
                })
            })
            .catch((error) => {
              console.log(error)
            })
        })
    },
    isAuthor: function () {
      return this.$store.getters['steem/loggedIn'] && this.$store.getters['steem/username'] === this.blog.author
    },
    startEdit: function () {
      this.$root.$emit('edit_post', this.blog)
    },
    showComments: function () {
      this.$emit('showComments')
    },
    toggleBookmark: function () {
      let bookmark = this.$store.getters['quearn/bookmark'](this.question.id)
      decryptAuthDetails(this.$store.getters['steem/authDetails'])
        .then((authDetails) => {
          if (bookmark) {
            this.$store.dispatch('quearn/removeBookmark', {
              vue: this,
              bookmark,
              username: this.$store.getters['steem/username'],
              pk: authDetails.steemPostingKey
            })
          } else {
            this.$store.dispatch('quearn/addBookmark', {
              vue: this,
              question: this.question,
              username: this.$store.getters['steem/username'],
              pk: authDetails.steemPostingKey
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  computed: {
    bookmarkcolor () {
      if (this.$store.getters['quearn/bookmark'](this.question.id)) {
        return 'secondary'
      } else {
        return ''
      }
    },
    getPayout () {
      return payout(this.blog)
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
