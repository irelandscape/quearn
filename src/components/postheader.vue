<template>
  <div v-if="blog">
    <q-chip v-if="topic" small square color="secondary" dense class="float-right">
      {{topic}}
    </q-chip>
    <div>
      <a href="#"
        @click="$router.push('userquestions', { user: blog.author })"
      >
        <img
          :src="avatar()"
          class="avatar no-shadow"
        />
      </a>
      <div style="display: inline-block;">
        <div class="author">
          {{blog.author}}
        </div>
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

  >>> .q-chip-main
    max-width: 5rem;
    white-space: normal;

</style>
