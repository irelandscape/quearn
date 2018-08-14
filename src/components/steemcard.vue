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
            <img
              :src="avatar()"
            />
            <div>
              {{blog.author}}
              in <span class="topic">{{topic}}</span><br/>
              <timeago :datetime="blog.created" :auto-update="60"></timeago>
            </div>
          </div>
        </q-card-title>
        <q-card-separator/>
        <q-card-main
          class="relative-position"
        >
          <div class="card" v-html="rendermd(blog.body)">
          </div>
        </q-card-main>
      </div>
      <q-card-separator/>
      <q-card-main class="tight">
        <steemblogctrl
          :blog="blog"
        >
        </steemblogctrl>
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
        return ''
      }
    },
    topic: function () {
      return this.metadata.tags[1]
    }
  },
  methods: {
    rendermd: function (str) {
      /*
      const removeMd = require('remove-markdown')
      str = removeMd(str, {
        stripListLeaders: false,
        useImgAltText: false
      })
      */

      let Remarkable = require('remarkable')
      let md = new Remarkable({
        html: true,
        linkify: true
      })
      console.log(this.blog)
      this.blogBody = md.render(str)
      return this.blogBody
    },
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

<style lang="stylus">
  .q-card-media img
    height: 10rem;
    width: auto;
    margin: auto;
    cursor: pointer;

  .q-card-title
    line-height: 1rem;
    cursor: pointer;

  .q-card-primary
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

  .fixedheight
    overflow: hidden;
    height: 25rem;

  .inlinecard
    //width: 15rem;

  .q-chip-main
    text-color: black;

  .q-card-subtitle
    margin-top: 0.5rem;

  .q-card-subtitle img
    float: left;
    height: 1.5rem;
    clip-path: circle(0.75rem at center);
    width: auto;

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
</style>
