<template>
  <div/>
</template>

<script>

export default {

  name: 'steemLoginfailure',
  mounted () {
    this.$q.notify({
      message: this.$tc('loginfailure') + ': ' + this.$route.query.error
    })
    this.$router.push('/')
  }
}

</script>
