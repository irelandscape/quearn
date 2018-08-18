<template>
  <q-page>
  </q-page>
</template>

<script>

export default {
  name: 'PageMyTopics',
  data: {
  },
  mounted () {
    let username = this.$store.getters['steem/username']
    let accessToken = this.$store.getters['steem/accessToken']
    let topics = this.$store.getters['steemqa/topics']
    let favouriteTopics = this.$store.getters['steemqa/favouriteTopics']

    if (favouriteTopics === null) {
      this.$store.dispatch('steemqa/favouriteTopics',
        {
          username,
          accessToken
        })
        .then(response => {
          this.updateTopics()
        })
    }

    if (topics === null) {
      this.$store.dispatch('steemqa/topics')
        .then(response => {
          this.updateTopics()
        })
    }
  },
  methods: {
    updateTopics: function () {
      let topics = this.$store.getters['steemqa/topics']
      let favouriteTopics = this.$store.getters['steemqa/favouriteTopics']

      if (topics == null || favouriteTopics == null) {
        return
      }

      for (let topic of topics) {
        console.log(topic)
      }
    }
  }
}

</script>

<style lang="stylus" scoped>
</style>
