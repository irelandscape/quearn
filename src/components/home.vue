<template>
  <div>
    <steemcard
      cssstyle="width: 350px; height: 200px"
    >
    </steemcard>
  </div>
</template>

<script>
import Steemcard from 'components/steemcard'

export default {
  name: 'Home',
  data () {
    return {
      steemcardstyle: 'width: 500px'
    }
  },
  methods: {
  },
  components: {
    Steemcard
  }
}
</script>

<style lang="stylus">
</style>
