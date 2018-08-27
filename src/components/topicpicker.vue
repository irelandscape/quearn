<template>
  <div>
    <q-field icon="label" label="Tag 1" >
      <q-select :options="primaryTopics()" value="primaryTopic" v-model="primaryTopic" @input="primaryChanged"/>
      <q-select :options="secondaryTopics()" value="secondaryTopic" v-model="secondaryTopic" @input="secondaryChanged"/>
      <q-select :options="ternaryTopics()" value="ternaryTopic" v-model="ternaryTopic"/>
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'topicpicker',
  data: function () {
    return {
      primaryTopic: '',
      secondaryTopic: '',
      ternaryTopic: ''
    }
  },
  methods: {
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
