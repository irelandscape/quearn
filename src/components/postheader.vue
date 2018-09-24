<template>
  <div v-if="blog">
    <q-chip v-if="topic" small square color="secondary" dense class="float-right">
      {{topic}}
    </q-chip>
    <img :src="avatar()" />
    <div style="display: inline-block;">
      <div class="author">
        {{blog.author}}
      </div>
      <div class="timestamp">
        <span v-if="fulldate">
          {{blog.created | timestamp}},
        </span>
        <timeago :datetime="blog.created" :auto-update="60"></timeago>
      </div>
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
    height: 1.5rem;
    clip-path: circle(0.75rem at center);
    width: auto;
    margin-right: 1rem;

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
