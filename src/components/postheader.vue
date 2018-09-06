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
      <timeago :datetime="blog.created" :auto-update="60"></timeago>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Postheader',
  props: {
    blog: null,
    metadata: null,
    topic: null
  },
  methods: {
    avatar () {
      return 'https://steemitimages.com/u/' + this.blog.author + '/avatar'
    }
  },
  mounted () {
    if (!this.blog) {
      return
    }
    this.metadata = JSON.parse(this.blog.json_metadata)
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

  time
    font-size: 0.8rem;
    color: #666666;
</style>
