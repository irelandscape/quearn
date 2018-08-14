<template>
  <q-tab-pane name="tab-home">
    <steemcarousel
      filter="trending"
      :query="{tag: 'steemstem'}"
    >
    </steemcarousel>
    <div class="content">
      <h2>{{ $t('latestquestions') }}</h2>
      <steemcardswiper
        filter="created"
        :query="{tag: 'steemstem'}"
      >
      </steemcardswiper>
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
  }
}
</script>

<style lang="stylus">
  .q-tab-pane
    padding: 0;
    border: 0;

  h2
    font-size: 1.7rem;

  .content
    padding: 1rem;
</style>
