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

    <topicpicker />

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
      helper="Use this field to elaborate on your question."
    >
      <q-input
        type="textarea"
        :value="input" @input="update"
        class="boxed"
      />
    </q-field>

    <q-field
      inset="full"
    >
      <q-btn
        color="primary"
        icon="send"
        :label="$t('submit')"
      />
    </q-field>

    <strong>Preview</strong>
    <div class="blog" v-html="compiledMarkdown"></div>
  </q-tab-pane>
</template>

<script>

import topicpicker from 'components/topicpicker'
var debounce = require('debounce')

export default {
  name: 'TabNewQuestion',
  components: {
    topicpicker
  },
  data: function () {
    return {
      text: '',
      input: ''
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

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

  .blog
    background: #eeeeee;
    border: 1px solid grey;

  .boxed
    border: 1px solid grey;
    padding: 0.2rem;
</style>
