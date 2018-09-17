<template>
  <swiper
    :options="swiperOption()"
    @reachEnd="onLastSlide()"
  >
    <swiper-slide
      v-for="question in questions" :key="question.id"
    >
      <steemcard :question="question"></steemcard>
    </swiper-slide>
  </swiper>
</template>

<script>
import Steemcard from 'components/steemcard'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import axios from 'axios'

export default {
  name: 'Steemcardswiper',
  props: {
    filters: {}
  },
  data () {
    return {
      questions: []
    }
  },
  methods: {
    swiperOption: function () {
      if (this.$q.platform.is.desktop) {
        return {
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          slidesPerView: window.innerWidth / 300,
          spaceBetween: 5
        }
      } else {
        return {
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          slidesPerView: 1,
          spaceBetween: 5
        }
      }
    },
    filtersToParams: function () {
      let data = Object.entries(this.filters)
      data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      return data.join('&')
    },
    onLastSlide: function () {
      let config = this.$store.getters['steemqa/config']

      axios.get(
        this.$store.getters['steemqa/serverURL'] +
          '/questions/?' +
          this.filtersToParams() +
          '&limit=' + config.initial_slides_count +
          '&offset=' + this.questions.length,
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((response) => {
        this.questions = this.questions.concat(response.data.results)
      }).catch(function (error) {
        console.log(error)
      })
    },
    getQuestions: function () {
      this.questions = []
      let config = this.$store.getters['steemqa/config']
      axios.get(
        this.$store.getters['steemqa/serverURL'] +
          '/questions/?' +
          this.filtersToParams() +
          '&limit=' + config.initial_slides_count,
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
  components: {
    Steemcard,
    swiper,
    swiperSlide
  },
  mounted () {
    this.getQuestions()
  },
  watch: {
    filters: function () {
      this.getQuestions()
    }
  }
}
</script>

<style lang="stylus">
</style>
