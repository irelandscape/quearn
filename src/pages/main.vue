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
        slot="title" icon="view_headline"
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
  mounted: function () {
  }
}
</script>

<style>
</style>
