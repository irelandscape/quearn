<template>
  <div v-if="blog">
    <div>
      <a href="#"
        @click="$router.push('userquestions', { user: blog.author })"
      >
        <div class="avatar">
          <img
            :src="avatar()"
            class="no-shadow"
          />
          <q-chip floating color="grey">
            <q-tooltip>
              reputation score
            </q-tooltip>
            {{reputation}}
          </q-chip>
        </div>
      </a>
      <div class="author">
        {{blog.author}}
      </div>
    </div>
    <div class="timestamp">
      <span v-if="fulldate">
        {{blog.created | timestamp}},
      </span>
      <timeago :datetime="blog.created" :auto-update="60"></timeago>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Postheader',
  props: {
    blog: null,
    topic: null,
    fulldate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    reputation: function () {
      let reputation = this.$store.getters['steem/reputation'](this.blog.author)

      if (reputation.length === 0) {
        this.$store.dispatch('steem/account', this.blog.author)
      }

      return reputation
    }
  },
  methods: {
    avatar () {
      return 'https://steemitimages.com/u/' + this.blog.author + '/avatar'
    }
  }
}
</script>

<style lang="stylus" scoped>
  img
    height: 2rem;
    float: left;
    width: auto;
    margin-right: 1rem;
    border-radius: 0;

  .author
    color: black;

  .timestamp
    margin-top: 0.5rem;
    color: grey;
    font-size: 0.8rem;

  time
    margin-top: 1rem;

  .avatar
    position: relative;
    width: 2.5rem;

  >>> .q-chip-main
    max-width: 5rem;
    white-space: normal;

</style>
