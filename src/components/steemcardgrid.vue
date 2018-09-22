<template>
  <div>
    <steemcard
      v-for="question in questions" :key="question.id"
      :question="question"
      class="gridcard"
    />
  </div>
</template>

<script>

import Steemcard from 'components/steemcard'
import axios from 'axios'

export default {
  name: 'Steemcardgrid',
  components: {
    Steemcard
  },
  props: {
    filters: {}
  },
  data () {
    return {
      questions: []
    }
  },
  methods: {
    filtersToParams: function () {
      let data = Object.entries(this.filters)
      data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      return data.join('&')
    },
    getQuestions: function () {
      this.questions = []
      let config = this.$store.getters['steemqa/config']
      axios.get(
        this.$store.getters['steemqa/serverURL'] +
          '/questions/?' +
          this.filtersToParams() +
          '&limit=' + config.initial_grid_batch_size,
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((response) => {
        this.questions = response.data.results
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  watch: {
    filters: function (val) {
      this.filters = val
      this.getQuestions()
    }
  },
  mounted () {
    this.getQuestions()
  }
}

</script>

<style lang="stylus" scoped>
  .gridcard
    width: 20rem;
    display: inline-block;
    margin: 0.3rem;
</style>
