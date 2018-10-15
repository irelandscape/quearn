<template>
  <q-tab-pane
    v-if="$store.getters['quearn/config']"
    name="tab-home" keep-alive >
    <steemcarousel
      filter="trending"
      :query="{tag: $store.getters['quearn/config'].tag}"
    >
    </steemcarousel>
    <div class="content">
      <q-chip
        square
        color="black"
        icon="access_time"
      >
        {{ $tc('latestquestions') }}
      </q-chip>
      <span class="swipe">swipe &gt;&gt;&gt;</span>
      <steemcardswiper
        :filters="{ordering: '-created'}"
      />

      <q-chip
        square
        color="black"
        icon="star"
      >
        {{ $tc('topratedquestions') }}
      </q-chip>
      <span class="swipe">swipe &gt;&gt;&gt;</span>
      <steemcardswiper
        :filters="{ordering: '-net_votes', created_gte: oldestDate}"
      />

      <q-chip
        square
        color="black"
        icon="new_releases"
      >
        {{ $tc('topratedanswers') }}
      </q-chip>
      <span class="swipe">swipe &gt;&gt;&gt;</span>
      <steemcardswiper
        :filters="{ordering: '-net_votes', created_gte: oldestDate}"
        :question=false
      />

      <q-chip
        square
        color="black"
        icon="priority_high"
      >
        {{ $tc('mostwantedanswers') }}
      </q-chip>
      <span class="swipe">swipe &gt;&gt;&gt;</span>
      <steemcardswiper
        :filters="{ordering: '-net_votes', answer_count: 0}"
      />
    </div>
  </q-tab-pane>
</template>

<script>
import Steemcardswiper from 'components/steemcardswiper'
import Steemcarousel from 'components/steemcarousel'

export default {
  name: 'TabHome',
  components: {
    Steemcardswiper,
    Steemcarousel
  },
  computed: {
    oldestDate: function () {
      let d = new Date()
      d.setDate(d.getDate() - this.$store.getters['quearn/config'].home_blog_history)
      return d.toISOString()
    }
  }
}
</script>

<style lang="stylus">
  .q-tab-pane
    padding: 0;
    border: 0;

  h2
    font-size: 1.2rem;
    color: #333333;
    margin-left: 1.2rem;

  .content
    padding: 1rem;

  .swiper-container
    margin-bottom: 1rem;

  .swipe
    margin-left: 3rem;
    color: #999999;
    float: right;
</style>
