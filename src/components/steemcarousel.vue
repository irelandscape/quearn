<template>
  <q-carousel
    :height="height"
    :autoplay=7000
    :infinite=true
    :easing="overshoot"
  >
    <q-carousel-slide
      v-for="blog in blogs" :key="blog.id"
    >
      <div v-if="$q.platform.is.desktop" class="desktop"
        v-on:click="showquestion(blog)"
      >
        <img :src="image(blog)" v-bind:style="{ maxHeight: height }"/>
        <h2>{{blog.title}}</h2>
        <span class="author">
          by {{blog.author}}
        </span>
        <div>
          <timeago :datetime="blog.created" :auto-update="60"></timeago>
        </div>
      </div>
      <div v-else class="mobile"
        v-on:click="showquestion(blog)"
      >
        <img :src="image(blog)"/>
        <h2>{{blog.title}}</h2>
        <span class="author">
          by {{blog.author}},
          <timeago :datetime="blog.created" :auto-update="60"></timeago>
        </span>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { easing } from 'quasar'
import { Client } from 'dsteem'

export default {
  name: 'Steemcarousel',
  components: {
  },
  props: {
    filter: String,
    query: Object,
    height: {
      default: '15rem',
      type: String
    }
  },
  data: function () {
    return {
      blogs: [],
      overshoot: easing.easeOutCubic
    }
  },
  methods: {
    image: function (blog) {
      let metadata = JSON.parse(blog.json_metadata)
      if (metadata.image) {
        return metadata.image[0]
      } else {
        return ''
      }
    },
    showquestion (blog) {
      this.$router.push({
        name: 'question',
        params: {
          blog: blog
        }
      })
    }
  },
  mounted () {
    const client = new Client('https://api.steemit.com')
    this.query.limit = 5
    client.database.getDiscussions(this.filter, this.query).then(response => {
      this.blogs = response
    })
  }
}
</script>

<style lang="stylus" scoped>

  .desktop img
    width: auto;
    max-width: 50%;
    margin: auto;
    float: left;
    margin-right: 1rem;

  .mobile img
    height: 7rem;
    width: auto;

  .q-carousel-slide
    background: black;
    padding: 0;
    cursor: pointer;

  .desktop h2
    color: white;
    font-size: 1.5rem;
    margin-top: 0;

  .mobile h2
    color: white;
    font-size: 1.0rem;

  .author
    color: #ffa500;
    font-style: italic;

  time
    color: grey;
    font-style: italic;
</style>
