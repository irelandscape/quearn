<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
      <q-toolbar-title>
        {{ $tc('about') }}
      </q-toolbar-title>
      <q-btn size="lg" @click="$router.go(-1)" >
        <q-icon name="close" outlined>
          <q-tooltip>Back</q-tooltip>
        </q-icon>
      </q-btn>
    </q-toolbar>

    <div class="blog shadow-1">
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageAbout',
  components: {
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

</style>
