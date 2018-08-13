<template>
  <div class="steemblogctrl">
    <q-btn
      round icon="keyboard_arrow_up"
      size="sm"
    >
      <q-tooltip>Upvote</q-tooltip>
    </q-btn>

    <q-btn
      :label="blog.pending_payout_value | sbd"
      flat
      size="md"
    />

    <q-btn
      icon="keyboard_arrow_up"
      flat
      size="md"
      title="upvotes"
    >
      {{blog.active_votes.length}}
    </q-btn>

    <q-btn
      icon="subdirectory_arrow_right"
      flat
      size="md"
    >
      <q-tooltip>Resteem</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'Steemblogctrl',
  components: {
  },
  props: {
    blog: Object
  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
