<template>
  <div>
    <q-card
      v-bind:class="{ inlinecard: $q.platform.is.desktop }"
    >
      <div class="fixedheight">
        <q-card-media overlay-position="bottom">
          <img :src="image" v-on:click="showquestion" />
        </q-card-media>
        <q-card-title>
          <span v-on:click="showquestion">{{blog.title}}</span>
          <div slot="subtitle">
            <q-chip square color="secondary" dense>
              {{topic}}
            </q-chip><br/>
            <img :src="avatar()" />
            <div>
              <div class="author">
                {{blog.author}}
              </div>
              <timeago :datetime="blog.created" :auto-update="60"></timeago>
            </div>
          </div>
        </q-card-title>
      </div>
      <q-card-main class="tight">
        <steemblogctrl :blog="blog" :condensed=true />
      </q-card-main>
    </q-card>
  </div>
</template>

<script>

import Steemblogctrl from 'components/steemblogctrl'

export default {
  name: 'Steemcard',
  components: {
    Steemblogctrl
  },
  props: {
    blog: Object
  },
  data: function () {
    return {
      metadata: null,
      blog_html: ''
    }
  },
  computed: {
    image: function () {
      if (this.metadata.image) {
        return this.metadata.image[0]
      } else {
        let images = this.blog.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
        if (images.length > 0) {
          return images[0]
        } else {
          return '/assets/atom.jpg'
        }
      }
    },
    topic: function () {
      return this.metadata.tags[1]
    }
  },
  methods: {
    /*
    rendermd: function (str) {
      let Remarkable = require('remarkable')
      let md = new Remarkable({
        html: true,
        linkify: true
      })
      this.blogBody = md.render(str)
      return this.blogBody
    },
    */
    avatar () {
      return 'https://steemitimages.com/u/' + this.blog.author + '/avatar'
    },
    showquestion () {
      this.$router.push({
        name: 'question',
        params: {
          blog: this.blog,
          blogBody: this.blogBody
        }
      })
    }
  },
  created () {
    this.metadata = JSON.parse(this.blog.json_metadata)
  }
}
</script>

<style lang="stylus" scoped>
  .content h2
    margin: 0;
    margin-bottom: 1rem;

  .q-card-media img
    height: 10rem;
    width: auto;
    margin: auto;
    cursor: pointer;

  .q-card-title
    height: 3rem;
    line-height: 1rem;
    cursor: pointer;
    overflow: hidden;

  .q-card-subtitle
    margin-top: 0.5rem;

  .author
    color: black;

  .q-card-subtitle img
    float: left;
    height: 1.5rem;
    clip-path: circle(0.75rem at center);
    width: auto;
    margin-right: 1rem;

  .topic
    font-weight: bold;

  .card h1, .card h2, .card h3, .card h4, .card h5
    font-size: 1rem;
    font-weight: bold;

  .card img
    width: 0
    height: 0

  .q-card-main .tight
    padding-top: 0
    padding-bottom: 0

  .q-chip
    position: absolute;
    right: 1rem;
</style>
