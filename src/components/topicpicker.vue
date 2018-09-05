<template>
  <div>
    <q-field icon="label" label="Tag 1" >
      <q-select :options="primaryTopics()" v-model="primaryTopic" @input="primaryChanged"/>
      <q-select :options="secondaryTopics()" v-model="secondaryTopic" @input="secondaryChanged"/>
      <q-select :options="ternaryTopics()" v-model="ternaryTopic"/>
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'topicpicker',
  props: {
    tags: null
  },
  data: function () {
    return {
      primaryTopic: '',
      secondaryTopic: '',
      ternaryTopic: ''
    }
  },
  watch: {
    tags: function () {
      this.setTopics()
    }
  },
  mounted: function () {
    this.setTopics()
  },
  methods: {
    selectTopicToTag: function () {
      let topic = ''
      if (this.ternaryTopic !== '') {
        topic = this.$store.getters['steemqa/topicStr'](this.ternaryTopic)
      } else if (this.secondaryTopic !== '') {
        topic = this.$store.getters['steemqa/topicStr'](this.secondaryTopic)
      } else if (this.primaryTopic !== '') {
        topic = this.$store.getters['steemqa/topicStr'](this.primaryTopic)
      }

      return topic.replace(' ', '-').toLowerCase()
    },
    setTopics: function () {
      if (!this.tags) {
        return
      }
      let topics = this.$store.getters['steemqa/topicsFromTags'](this.tags)
      if (topics.primary) {
        this.primaryTopic = topics.primary.id
      }
      if (topics.secondary) {
        this.secondaryTopic = topics.secondary.id
      }
      if (topics.ternary) {
        this.ternaryTopic = topics.ternary.id
      }
    },
    primaryChanged: function () {
      this.secondaryTopic = ''
    },
    secondaryChanged: function () {
      this.ternaryTopic = ''
    },
    primaryTopics: function () {
      let topics = [{
        label: this.$tc('choosetopic'),
        value: '',
        icon: 'school'
      }]

      for (let topic of this.$store.getters['steemqa/topics']) {
        if (topic.parent) {
          continue
        }
        topics.push({
          label: topic.topic,
          value: topic.id
        })
      }

      return topics
    },
    secondaryTopics: function () {
      let topics = []

      for (let topic of this.$store.getters['steemqa/topics']) {
        if (topic.parent !== this.primaryTopic) {
          continue
        }
        topics.push({
          label: topic.topic,
          value: topic.id
        })
      }

      if (topics.length) {
        topics.unshift({
          label: this.$tc('subtopicsavailable'),
          value: '',
          leftInverted: true
        })
      }

      return topics
    },
    ternaryTopics: function () {
      let topics = []

      for (let topic of this.$store.getters['steemqa/topics']) {
        if (topic.parent !== this.secondaryTopic) {
          continue
        }
        topics.push({
          label: topic.topic,
          value: topic.id
        })
      }

      if (topics.length) {
        topics.unshift({
          label: this.$tc('subtopicsavailable'),
          value: '',
          leftInverted: true
        })
      }

      return topics
    }
  }
}
</script>

<style lang="stylus" scoped>
</script>
