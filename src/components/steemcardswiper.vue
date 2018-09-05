<template>
  <swiper :options="swiperOption()">
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
    ordering: String
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
          spaceBetween: 10
        }
      }
    }
  },
  components: {
    Steemcard,
    swiper,
    swiperSlide
  },
  created () {
    axios.get(
      this.$store.getters['steemqa/serverURL'] + '/questions/?ordering=' + this.ordering,
      {
        params: {
          username: this.$store.getters['steem/username'],
          access_token: this.$store.getters['steem/accessToken']
        }
      }
    ).then((response) => {
      this.questions = response.data
    }).catch(function (error) {
      console.log(error)
    })
  }
}
</script>

<style lang="stylus">
</style>
