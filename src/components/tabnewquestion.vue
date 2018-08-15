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
      <q-select :options="primaryTopics" value="primaryTopic" v-model="primaryTopic"/>
      <q-select :options="secondaryTopics" value="secondaryTopic" v-model="secondaryTopic"/>
      <q-select :options="ternaryTopics" value="ternaryTopic" v-model="ternaryTopic"/>
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

var debounce = require('debounce')

export default {
  name: 'TabNewQuestion',
  components: {
  },
  data: function () {
    return {
      text: '',
      input: '',
      primaryTopic: '',
      secondaryTopic: '',
      ternaryTopic: ''
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
    },
    primaryTopics: function () {
      let topics = [{
        label: this.$tc('choosetopic'),
        value: '',
        icon: 'school'
      }]

      for (let topic in this.$store.getters['steemqa/topics']) {
        topics.push({
          label: topic,
          value: topic
        })
      }

      return topics
    },
    secondaryTopics: function () {
      if (this.primaryTopic.length === 0) {
        return []
      }

      let topics = [
      ]

      for (let topic in this.$store.getters['steemqa/topics'][this.primaryTopic]) {
        topics.push({
          label: topic,
          value: topic
        })
      }

      return topics
    },
    ternaryTopics: function () {
      if (this.primaryTopic.length === 0 || this.secondaryTopic.length === 0) {
        return []
      }

      let topics = []

      for (let topic of this.$store.getters['steemqa/topics'][this.primaryTopic][this.secondaryTopic]) {
        topics.push({
          label: topic,
          value: topic
        })
      }

      return topics
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
