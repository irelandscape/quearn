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
        slot="title" icon="search"
        name="tab-search"
        to="search"
      >
        {{ $t('search') }}
      </q-route-tab>
      <router-view/>
    </q-tabs>
  </q-page>
</template>

<script>

export default {
  name: 'PageMain',
  components: {
  }
}
</script>

<style>
</style>
