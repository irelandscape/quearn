<template>
  <q-tab-pane name="tab-home" keep-alive >
    <steemcarousel
      filter="trending"
      :query="{tag: $store.getters['steemqa/config'].tag}"
    >
    </steemcarousel>
    <div class="content">
      <h2>{{ $t('latestquestions') }}</h2>
      <steemcardswiper
        ordering="created"
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
    font-size: 1.2rem;
    color: #333333;
    margin-left: 1.2rem;

  .content
    padding: 1rem;
</style>
