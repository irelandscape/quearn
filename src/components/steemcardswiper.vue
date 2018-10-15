<template>
  <swiper
    :options="swiperOption()"
    @reachEnd="onLastSlide()"
  >
    <swiper-slide
      v-for="blog in blogs" :key="blog.id"
    >
      <steemcard :discussion="blog"></steemcard>
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
    filters: {},
    question: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      blogs: []
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
      let config = this.$store.getters['quearn/config']

      axios.get(
        this.$store.getters['quearn/serverURL'] +
          '/' + (this.question ? 'questions' : 'answers') + '/?' +
          this.filtersToParams() +
          '&limit=' + config.initial_slides_count +
          '&offset=' + this.blogs.length,
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((response) => {
        this.blogs = this.blogs.concat(response.data.results)
      }).catch(function (error) {
        console.log(error)
      })
    },
    getblogs: function () {
      this.blogs = []
      let config = this.$store.getters['quearn/config']
      axios.get(
        this.$store.getters['quearn/serverURL'] +
          '/' + (this.question ? 'questions' : 'answers') + '/?' +
          this.filtersToParams() +
          '&limit=' + config.initial_slides_count,
        {
          params: {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken']
          }
        }
      ).then((response) => {
        this.blogs = response.data.results
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
    this.getblogs()
  },
  watch: {
    filters: function () {
      this.getblogs()
    }
  }
}
</script>

<style lang="stylus">
</style>
