<template>
  <q-tab-pane name="tab-newquestion">
    <q-field
      icon="title"
      label="Title"
      :helper="$t('questionrequirement')"
    >
      <q-input
        type="text"
        value=""
      />
    </q-field>

    <q-field icon="label" label="Tag 1" >
      <q-select :options="topics" value=""/>
    </q-field>
    <q-field icon="label" label="Tag 2" >
      <q-input type="text" value=""/>
    </q-field>
    <q-field icon="label" label="Tag 3" >
      <q-input type="text" value=""/>
    </q-field>
    <q-field icon="label" label="Tag 4" >
      <q-input type="text" value=""/>
    </q-field>

    <q-field
      icon="notes"
      label="Description"
      label-width=1
      helper="Use this field to elaborate on your question."
    >
      <q-input
        type="textarea"
        :value="input" @input="update"
      />
    </q-field>
    <strong>Preview</strong>
    <div class="result" v-html="compiledMarkdown"></div>
  </q-tab-pane>
</template>

<script>

var debounce = require('debounce')

export default {
  name: 'TabNewQuestion',
  components: {
  },
  data: function () {
    return {
      text: '',
      input: '',
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
  },
  computed: {
    compiledMarkdown: function () {
      let Remarkable = require('remarkable')
      let md = new Remarkable({
        html: true,
        linkify: true
      })
      return md.render(this.input)
    }
  },
  methods: {
    update: debounce(function (value) {
      this.input = value
    }, 300)
  }
}
</script>

<style lang="stylus">
  .result
    padding: 1rem;
    background: #eeeeee;
    border: 1px solid #666666;

</style>
