<template>
  <q-tab-pane name="tab-search">
    <q-field icon="label" label="Topic" >
      <q-select :options="topics" value=""/>
    </q-field>

    <q-field icon="label" label="Sub-topic" >
      <q-select :options="topics" value=""/>
    </q-field>
    <q-field
      icon="title"
      label="Title text"
    >
      <q-input type="text" value=""/>
    </q-field>

    <q-field
      inset="full"
    >
      <q-btn
        color="primary"
        icon="search"
        :label="$t('search')"
      />
    </q-field>

    <h2>Results</h2>
  </q-tab-pane>
</template>

<script>

export default {
  name: 'TabSearch',
  components: {
  },
  data: function () {
    return {
      topics: [
        {
          label: 'science',
          value: 'science'
        },
        {
          label: 'technology',
          value: 'technology'
        }
      ]
    }
  }
}
</script>

<style>
</style>
