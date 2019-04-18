<template>
  <q-page>
    <q-tabs
      class="justified"
      align="center"
      :inverted="$q.theme === 'ios'"
    >
      <q-route-tab
        default slot="title" icon="home"
        name="tab-home"
        to="/"
      >
        {{ $t('home') }}
      </q-route-tab>
      <q-route-tab
        slot="title" icon="question_answer"
        name="tab-newquestion"
        to="/newquestion"
      >
        {{ $t('newquestion') }}
      </q-route-tab>

      <q-route-tab
        slot="title" icon="remove_red_eye"
        name="tab-topics"
        to="topics"
      >
        {{ $t('topics') }}
      </q-route-tab>
      <q-route-tab
        slot="title" icon="local_library"
        name="tab-news"
        to="news"
      >
        {{ $t('news') }}
      </q-route-tab>
      <router-view/>
    </q-tabs>
  </q-page>
</template>

<script>

export default {
  name: 'PageMain',
  meta () {
    return {
      meta: [
        {
          property: 'og:site_name',
          content: this.$store.getters['quearn/config'].site_name.length ? this.$store.getters['quearn/config'].site_name : ''
        },
        {
          property: 'og:url',
          content: this.$store.getters['quearn/config'].url.length ? this.$store.getters['quearn/config'].url : ''
        },
        {
          property: 'og:image',
          content: this.$store.getters['quearn/config'].image.length ? this.$store.getters['quearn/config'].image : ''
        },
        {
          property: 'og:title',
          content: this.$store.getters['quearn/config'].title.length ? this.$store.getters['quearn/config'].title : ''
        },
        {
          property: 'og:description',
          content: this.$store.getters['quearn/config'].description.length ? this.$store.getters['quearn/config'].description : ''
        }
      ]
    }
  },
  mounted: function () {
  }
}
</script>

<style>
</style>
