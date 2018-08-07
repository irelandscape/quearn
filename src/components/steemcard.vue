<template>
  <div>
    <q-card
      inline
      v-bind:style="cssstyle"
    >
      <q-card-title>
        My Title
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        {{cssstyle}}
      </q-card-main>
    </q-card>
  </div>
</template>

<script>

export default {
  name: 'Steemcard',
  props: {
    cssstyle: String
  },
  data: function () {
    return {
      width: '350px'
    }
  },
  mounted () {
    console.log(require('crypto').randomBytes(64))
    var steem = require('steem')
    console.log(steem)
    /*
    steem.api.getBlock(58678105, function (err, result) {
      console.log(err, result)
    })
      */
  }
}

</script>

<style lang="stylus">
</style>
