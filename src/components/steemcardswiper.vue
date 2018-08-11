<template>
  <swiper :options="swiperOption">
    <swiper-slide
      v-for="blog in blogs" :key="blog.id"
    >
      <steemcard :blog="blog"></steemcard>
    </swiper-slide>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>

<script>
import Steemcard from 'components/steemcard'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Client } from 'dsteem'

export default {
  name: 'Steemcardswiper',
  props: {
    query: Object
  },
  data () {
    return {
      blogs: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        slidesPerView: window.innerWidth / 300,
        spaceBetween: 10
      }
    }
  },
  components: {
    Steemcard,
    swiper,
    swiperSlide
  },
  mounted () {
    const client = new Client('https://api.steemit.com')
    this.query.limit = 10
    client.database.getDiscussions('created', this.query).then(response => {
      console.log(response)
      this.blogs = response
    })
  }
}
</script>

<style lang="stylus">
</style>
