<!-- auth callback (oauth) -->

<!-- component script -->
<script>
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
      return this.$store.dispatch('auth/login', get(this.$route, 'query'))
    }
  },
  mounted () {
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
