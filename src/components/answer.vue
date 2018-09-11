<template>
  <q-collapsible
    group="answers"
    :opened="opened"
  >
    <template slot="header">
      <q-item-main>
        <postheader
          :blog="blog"
        />
      </q-item-main>
    </template>

    <div v-if="blog">
      <div v-html="getBlogBody()" />
      <steemblogctrl
        :blog="blog"
        :condensed=false
      />
    </div>
    <hr/>
  </q-collapsible>
</template>

<script>
import Steemblogctrl from 'components/steemblogctrl'
import Postheader from 'components/postheader'

export default {
  name: 'Answer',
  components: {
    Steemblogctrl,
    Postheader
  },
  props: {
    answer: null,
    opened: false
  },
  data () {
    return {
      blog: null
    }
  },
  methods: {
    getBlogBody: function () {
      let Remarkable = require('remarkable')
      let md = new Remarkable('full', {
        html: true,
        linkify: true
      })
      return md.render(this.blog.body)
    }
  },
  mounted () {
    let dsteem = this.$store.getters['steem/dsteem']
    dsteem.database.call('get_content',
      [this.answer.author, this.answer.permlink]
    ).then(response => {
      this.blog = response
    }).catch(function (err) {
      this.$q.notify({
        message: this.$tc('failedtogetanswerfromsteem'),
        detail: err.error_description,
        type: 'negative'
      })
    })
  }
}
</script>

<style lang="stylus">
  .q-collapsible-opened .q-item
    background-color: #eeeeee;
</style>
