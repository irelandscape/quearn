<template>
  <q-carousel
    :height="height"
    :autoplay=7000
    :infinite=true
    :easing="overshoot"
  >
    <q-carousel-slide
      v-for="blog in blogs" :key="blog.id"
    >
      <div v-if="$q.platform.is.desktop" class="desktop"
        v-on:click="showquestion(blog)"
      >
        <img :src="image(blog)" v-bind:style="{ maxHeight: height }"/>
        <h2>{{blog.title}}</h2>
        <span class="author">
          by {{blog.author}}
        </span>
        <div>
          <timeago :datetime="blog.created" :auto-update="60"></timeago>
        </div>
        <q-btn-group>
          <q-btn icon="attach_money"
            :label="blog.pending_payout_value | sbd"
            size="md"
            disabled
            class="tight"
          />
          <q-btn icon="question_answer"
            size="md"
            title="answers"
            disabled
            :label="blog.answer_count"
          />
        </q-btn-group>
      </div>
      <div v-else class="mobile"
        v-on:click="showquestion(blog)"
      >
        <h2>{{blog.title}}</h2>
        <span class="author">
          by {{blog.author}},
          <timeago :datetime="blog.created" :auto-update="60"></timeago>
          <q-btn-group>
            <q-btn
              :label="blog.pending_payout_value | sbd"
              flat size="md"
            />
          </q-btn-group>
        </span>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { easing } from 'quasar'
import axios from 'axios'

export default {
  name: 'Steemcarousel',
  components: {
  },
  props: {
    filter: String,
    query: Object,
    height: {
      default: '15rem',
      type: String
    }
  },
  data: function () {
    return {
      blogs: [],
      overshoot: easing.easeOutCubic
    }
  },
  methods: {
    image: function (blog) {
      let metadata = JSON.parse(blog.json_metadata)
      if (metadata.image) {
        return metadata.image[0]
      } else {
        let images = blog.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
        if (images !== null && images.length > 0) {
          return images[0]
        } else {
          return '/assets/atom.jpg'
        }
      }
    },
    showquestion: function (blog) {
      this.$router.push({
        name: 'question',
        params: {
          blog: blog
        }
      })
    },
    getQuestionFromSteem (question) {
      let dsteem = this.$store.getters['steem/dsteem']
      dsteem.database.call('get_content',
        [question.author, question.permlink]
      ).then(response => {
        console.log(question.answer_count)
        if (question.answer_count) {
          response.answer_count = question.answer_count
        } else {
          response.answer_count = 0
        }
        this.blogs.push(response)
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted () {
    let d = new Date()
    d.setDate(d.getDate() - this.$store.getters['quearn/config'].carousel_history)
    d = encodeURIComponent(d.toISOString())
    axios.get(
      this.$store.getters['quearn/serverURL'] + '/questions/?ordering=-net_votes&created_gte=' + d + '&limit=' +
        this.$store.getters['quearn/config'].carousel_slide_count,
      {
        params: {
          username: this.$store.getters['steem/username'],
          access_token: this.$store.getters['steem/accessToken']
        }
      }
    ).then((questions) => {
      for (let question of questions.data.results) {
        this.getQuestionFromSteem(question)
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
}
</script>

<style lang="stylus" scoped>

  .desktop img
    width: auto;
    max-width: 50%;
    margin: auto;
    float: left;
    margin-right: 1rem;

  .mobile img
    height: 7rem;
    width: auto;

  .q-carousel-slide
    background: black;
    padding: 0;
    cursor: pointer;

  .desktop h2
    color: white;
    font-size: 1.5rem;
    margin-top: 0;

  .mobile h2
    color: white;
    font-size: 1.0rem;

  .author
    color: #ffa500;
    font-style: italic;
    color: grey;

  time
    font-style: italic;
    color: grey;

  .q-btn
    padding-left: 0
    color: white;

  .tight .on-left
    margin-right: 0;

  >>> .on-left
    margin-right: 0;

</style>
