<template>
  <q-tab-pane name="tab-home">
    <steemcardswiper
      :query="{tag: 'steemstem'}"
    >
    </steemcardswiper>
  </q-tab-pane>
</template>

<script>
import Steemcardswiper from 'components/steemcardswiper'

export default {
  name: 'TabHome',
  components: {
    Steemcardswiper
  }
}
</script>

<style>
</style>
