<template>
  <q-alert type="warning"
    text-color="primary"
    class="q-mt-lg"
    :actions="[
      { label: 'login', icon: 'exit_to_app', handler: login },
      { label: 'signup', icon: 'account_circle', handler: () => { $root.emit('signup') } }]"
  >
    {{$tc('youmustbeloggedin')}}
    <br/>
    {{$tc('pleaseloginorsignup')}}
  </q-alert>
</template>

<script>

export default {
  name: 'Loginorsignup',
  components: {
  },
  methods: {
    login: function () {
      this.$root.$emit('login')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~variables'

  >>> .q-alert
    max-width: 50rem;
    padding: 1rem;
    margin: auto;
    background: $warning;
</style>
