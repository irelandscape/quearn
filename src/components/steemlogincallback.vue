<!-- auth callback (oauth) -->

<!-- component script -->
<script>
console.log('A')
// imports.
import { get } from 'lodash-es'

// auth callback component.
export default {

  // component name,
  name: 'u-auth-callback',

  // component methods.
  methods: {
    // parse oauth callback query.
    parseQuery () {
      console.log(get(this.$route, 'query'))
      return this.$store.dispatch('auth/login', get(this.$route, 'query'))
    }
  },

  // mounted hook.
  mounted () {
    console.log('hello')
    // call the parse query method upon render.
    return this.parseQuery()
      .then(() => {
        // after, redirect root after login.
        this.$router.push({ name: '/' })
      })
  }
}
</script>

<!-- component template -->
<template lang="pug">
  <div/>
</template>
