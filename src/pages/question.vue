<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
        <q-toolbar-title>
          {{blog.title}}
            <div slot="subtitle">by {{ blog.author }}</div>
        </q-toolbar-title>
        <q-btn
          @click="login()"
          size="lg"
          to="/"
        >
          <q-icon name="close" outlined >
            <q-tooltip>Back</q-tooltip>
          </q-icon>
        </q-btn>
    </q-toolbar>
    <div class="content">
      <div v-html="blogBody" />
      <steemblogctrl :blog="blog" />
    </div>
  </q-page>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'

export default {
  name: 'PageQuestion',
  components: {
    Steemblogctrl
  },
  props: {
    blog: Object,
    blogBody: String
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
  >>> h1
    font-size: 2rem;
    font-weight: bold;
  >>> h2
    font-size: 1.7rem;
  >>> h3
    font-size: 1.5rem;
  >>> h4
    font-size: 1.3rem;
  >>> h5
    font-size: 1.1rem;
  >>> img
    max-width: 100%;
    heigth:  auto;

  .content
    margin: auto;
    padding: 2rem;
    max-width: 800px;
    word-break: break-all;
    word-wrap: break-word;

</style>
