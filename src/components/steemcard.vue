<template>
  <div>
    <q-card
      v-bind:class="{ inlinecard: $q.platform.is.desktop }"
    >
      <q-card-media overlay-position="bottom">
        <img :src="image" />

      </q-card-media>
      <q-card-title
      >
        {{blog.title}}
        <span slot="subtitle">{{topic}}</span>
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <div class="card">
          <vue-markdown
            :prerender="prerender"
          >
            {{blog.body}}
          </vue-markdown>
        </div>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>

import VueMarkdown from 'vue-markdown'

export default {
  name: 'Steemcard',
  components: {
    VueMarkdown
  },
  props: {
    blog: Object
  },
  data: function () {
    return {
      metadata: null
    }
  },
  computed: {
    image: function () {
      return this.metadata.image[0]
    },
    topic: function () {
      return this.metadata.tags[1]
    }
  },
  methods: {
    prerender: function (str) {
      const removeMd = require('remove-markdown')
      return removeMd(str, {
        stripListLeaders: false,
        useImgAltText: false
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

  .q-card-title
    line-height: 1rem;

  .q-card-primary
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

  .q-card
    overflow: hidden;
    height: 25rem;

  .inlinecard
    //width: 15rem;

</style>
