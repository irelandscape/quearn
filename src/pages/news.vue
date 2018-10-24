<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
      <q-toolbar-title>
        {{ $t('news') }}
      </q-toolbar-title>
      <q-btn size="lg" @click="$router.go(-1)" >
        <q-icon name="close" outlined>
          <q-tooltip>Back</q-tooltip>
        </q-icon>
      </q-btn>
    </q-toolbar>

    <div v-for="blog in blogs"
      :key="blog.id"
      class="blog shadow-1"
    >
      <div>
        <div class="timestamp">
          {{blog.created | timestamp}}
          (<timeago :datetime="blog.created" :auto-update="60"></timeago>)
        </div>
        <div v-if="blog.body.length">
          <h2>{{blog.title}}</h2>
          <div style="text-align: center;">
            <img :src="image(blog)" />
          </div>
        </div>
        <div v-if="blog.body.length"
          class="blogsummary"
          v-html="getBlogBody(blog)"
        />
        <steemblogctrl v-if="blog"
          :blog="blog"
          :condensed=false
        />
        <q-spinner-gears v-else />
      </div>
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import { md2html } from 'components/utils/markdown'

export default {
  name: 'News',
  components: {
    Steemblogctrl
  },
  data: function () {
    return {
      blogs: []
    }
  },
  methods: {
    image: function (blog) {
      let metadata = JSON.parse(blog.json_metadata)
      if (metadata.image) {
        return metadata.image[0]
      } else {
        let images = blog.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
        if (images !== null && images.length > 0) {
          return images[0]
        } else {
          return '/assets/atom.jpg'
        }
      }
    },
    getBlogBody: function (blog) {
      return md2html(blog.body,
        this.$store.getters['quearn/xss'],
        this.$store.getters['quearn/config'].post_addon_msg)
    },
    getNews: function (sources) {
      let dsteem = this.$store.getters['steem/dsteem']

      for (let source of sources.split(',')) {
        let username = source.split(':')[0]
        let tag = source.split(':')[1]

        console.log(tag)
        dsteem.database.getDiscussions(
          'created',
          {
            tag: tag,
            limit: 10
          }).then(response => {
          console.log(response)
          let blogs = []
          for (let blog of response) {
            if (blog.author === username) {
              blogs.push(blog)
            }
          }
          this.blogs = [...blogs]
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  },
  mounted () {
    let sources = this.$store.getters['quearn/config'].news_sources

    if (sources && sources.length) {
      this.getNews(sources)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

  .q-toolbar-title
    white-space: normal;

  .timestamp
    margin-top: 0.5rem;
    color: grey;
    font-size: 0.8rem;

  time
    margin-top: 1rem;

  h2
    margin: 0
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

  img
    max-height: 20rem;
    margin: auto;

  .q-toolbar
    position: fixed;
    top: 50px;
    z-index: 1;

  .blog
    margin-top: 80px;
</style>
