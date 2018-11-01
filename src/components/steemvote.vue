<template>
  <span>
    <q-btn
      icon="keyboard_arrow_up"
      flat
      dense
      v-bind:class="{ 'bg-secondary': voted }"
      @click="voteDialogModel = true"
    >
    </q-btn>
    <q-dialog
      v-model="voteDialogModel"
      @ok='onOK'
      :title="$tc('upvote')"
      v-show=true
      ok='Vote'
      :cancel=true
      prevent-close
    >
      <div slot="body">
        <q-chip square color="secondary">
          {{ $t('votingweight') }}: {{ voteWeight }} %
        </q-chip>

        <q-slider
          v-model="voteWeight"
          :min=0
          :max=100
          :step="10"
        />
      </div>
    </q-dialog>
  </span>
</template>

<script>
export default {
  name: 'Steemvote',
  props: {
    blog: Object
  },
  data () {
    return {
      voteDialogModel: false,
      voteWeight: 100,
      voted: false
    }
  },
  mounted: function () {
    this.voted = false
    for (let vote of this.blog.active_votes) {
      if (vote.voter === this.$store.getters['steem/username']) {
        if (vote.percent !== 0) {
          this.voted = true
          this.voteWeight = vote.percent / 100
        }
        break
      }
    }
  },
  methods: {
    showDialog () {
      console.log('click!')
      this.$q.dialog({
        title: 'MY TITLE',
        message: 'MESSAGE'
      })
    },
    btnColor () {
      if (this.voted) {
        return 'secondary'
      } else {
        return ''
      }
    },
    onOK (data) {
      this.$q.loading.show({
        message: this.$tc('voting')
      })
      this.$store.commit('steem/votingWeight', this.voteWeight)
      this.$store.getters['steem/client'].vote(
        this.$store.getters['steem/username'],
        this.blog.author,
        this.blog.permlink,
        this.voteWeight * 100
      ).then(() => {
        if (this.voteWeight !== 0) {
          this.voted = true
        } else {
          this.voted = false
        }
        this.$q.loading.hide()
      }).catch((err) => {
        this.$q.notify({
          message: this.$i18n.tc('votingfailed'),
          detail: err.error_description,
          type: 'negative'
        })
        this.$q.loading.hide()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .modal-body
    padding: 2rem;

  .q-btn
    color: #666666;
    margin-right: 0.2rem;
    padding-top: 0;
    padding-bottom: 0;
</style>
