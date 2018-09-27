<template>
  <div>
    <steemcard
      v-for="question in questions" :key="question.id"
      :question="question"
      class="gridcard"
    />
    <q-btn
      :label="nomoreresults ? $tc('nomoreresults') : $tc('nextresults')"
      icon="skip_next"
      class="full-width q-mb-md"
      color="black"
      @click="getQuestions(reset=false)"
      :disable="nomoreresults"
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
      questions: [],
      nomoreresults: false
    }
  },
  methods: {
    filtersToParams: function () {
      let data = Object.entries(this.filters)
      data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      return data.join('&')
    },
    getQuestions: function (reset = true) {
      if (reset) {
        this.questions = []
        this.nomoreresults = false
      }
      let config = this.$store.getters['quearn/config']
      axios.get(
        this.$store.getters['quearn/serverURL'] +
          '/questions/?' +
          this.filtersToParams() +
          '&limit=' + config.initial_grid_batch_size +
          '&offset=' + this.questions.length,
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((response) => {
        this.questions = this.questions.concat(response.data.results)
        if (response.data.results.length < config.initial_grid_batch_size) {
          this.nomoreresults = true
        }
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
    width: 18rem;
    display: inline-block;
    margin: 0.3rem;

  @media (max-width:500px) {
    .gridcard {
      width: 100%;
    }
  }

  .mobile
    width: 100%;
</style>
