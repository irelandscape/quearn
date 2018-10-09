<template>
  <q-tab-pane name="tab-newquestion">
    <editblog :isquestion=true
      v-if="this.$store.getters['steem/loggedIn']"
      @editcompleted="onQuestionCompleted"
    />
    <loginorsignup v-else/>
  </q-tab-pane>
</template>

<script>

import Editblog from 'components/editblog'
import Loginorsignup from 'components/loginorsignup'

export default {
  name: 'TabNewQuestion',
  components: {
    Editblog,
    Loginorsignup
  },
  methods: {
    onQuestionCompleted: function () {
      this.$router.go(-1)
    }
  }
}
</script>
