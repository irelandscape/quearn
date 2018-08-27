<template>
  <div class="steemblogctrl">
    <steemvote
      :blog='blog'
    />
    <q-btn :label="blog.pending_payout_value | sbd" flat size="md"/>
    <q-btn icon="format_quote" round size="xs">
      <q-tooltip>Overview</q-tooltip>
    </q-btn>
    <q-btn icon="keyboard_arrow_up" flat size="md" title="upvotes">
      {{blog.active_votes.length}}
    </q-btn>
    <q-btn icon="subdirectory_arrow_right" round size="xs">
      <q-tooltip>Resteem</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import Steemvote from 'components/steemvote'

export default {
  name: 'Steemblogctrl',
  components: {
    Steemvote
  },
  props: {
    blog: Object
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
  .steemblogctrl
    color: #999999;

  .q-btn
    color: #666666;
</style>
