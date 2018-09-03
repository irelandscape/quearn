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
          <span v-on:click="showquestion">{{title}}</span>
          <div slot="subtitle">
            <q-chip square color="secondary" dense>
              {{topic}}
            </q-chip><br/>
            <img :src="avatar()" />
            <div>
              <div class="author">
                {{author}}
              </div>
              <timeago :datetime="created" :auto-update="60"></timeago>
            </div>
          </div>
        </q-card-title>
      </div>
      <q-card-main class="tight">
        <steemblogctrl v-if="blog" :blog="blog" :condensed=true />
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
    question: Object
  },
  data: function () {
    return {
      blog: null,
      metadata: null,
      blog_html: ''
    }
  },
  computed: {
    image: function () {
      if (!this.blog) {
        return ''
      }
      if (this.metadata.image) {
        return this.metadata.image[0]
      } else {
        let images = this.blog.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
        if (images !== null && images.length > 0) {
          return images[0]
        } else {
          return '/assets/atom.jpg'
        }
      }
    },
    topic: function () {
      if (this.blog) {
        return this.metadata.tags[1]
      } else {
        return ''
      }
    },
    created: function () {
      if (this.blog) {
        return this.blog.created
      } else {
        return ''
      }
    },
    title: function () {
      if (this.blog) {
        return this.blog.title
      } else {
        return ''
      }
    },
    author: function () {
      if (this.blog) {
        return this.blog.author
      } else {
        return ''
      }
    }
  },
  methods: { /* rendermd: function (str) { let Remarkable = require('remarkable') let md = new Remarkable({ html: true,
        linkify: true
      })
      this.blogBody = md.render(str)
      return this.blogBody
    },
    */
    avatar () {
      if (this.blog) {
        return 'https://steemitimages.com/u/' + this.blog.author + '/avatar'
      } else {
        return ''
      }
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
    let dsteem = this.$store.getters['steem/dsteem']
    dsteem.database.call('get_content',
      [this.question.author, this.question.permlink]
    ).then(response => {
      this.blog = response
      this.metadata = JSON.parse(this.blog.json_metadata)
    }).catch(function (err) {
      this.$q.notify({
        message: this.$tc('editfailure'),
        detail: err.error_description,
        type: 'negative'
      })
    })
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
