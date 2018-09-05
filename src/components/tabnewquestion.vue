<template>
  <q-tab-pane name="tab-newquestion">
    <editblog :isquestion=true />
  </q-tab-pane>
</template>

<script>

import Editblog from 'components/editblog'

export default {
  name: 'TabNewQuestion',
  components: {
    Editblog
  }
}
</script>
