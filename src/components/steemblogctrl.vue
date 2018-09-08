<template>
  <div class="steemblogctrl">
    <div>
      <q-btn
        icon="attach_money"
        :label="blog.pending_payout_value | sbd"
        flat size="md"
        class="tight"
      />
      <q-btn icon="keyboard_arrow_up" flat size="md" title="upvotes">
        {{blog.active_votes.length}}
      </q-btn>
    </div>
    <div>
      <steemvote
        :blog='blog'
      />
      <q-btn v-if="condensed" icon="format_quote" size="xs">
        <q-tooltip>Overview</q-tooltip>
      </q-btn>
      <q-btn icon="subdirectory_arrow_right" size="xs">
        <q-tooltip>Resteem</q-tooltip>
      </q-btn>
      <q-btn
        v-if="!condensed"
        icon="edit"
        size="xs"
        @click="startEdit()">
        <q-tooltip>Edit</q-tooltip>
      </q-btn>
      <q-btn
        icon="question_answer"
        size="xs"
        title="answers"
        disabled
        :label="answer_count"
      />
    </div>
  </div>
</template>

<script>
import Steemvote from 'components/steemvote'

export default {
  name: 'Steemblogctrl',
  data () {
    return {
    }
  },
  components: {
    Steemvote
  },
  props: {
    blog: null,
    condensed: false,
    answer_count: null
  },
  methods: {
    startEdit: function () {
      this.$root.$emit('edit_post', this.blog)
    }
  }
}
</script>

<style lang="stylus">
  .steemblogctrl
    color: #999999;

  .q-btn
    color: #666666;
    margin-right: 0.2rem;
    padding-top: 0;
    padding-bottom: 0;

  .tight .on-left
    margin-right: 0;
</style>
