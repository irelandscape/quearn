<template>
  <div>
    <q-field icon="label" label="Tag 1" >
      <q-select :options="primaryTopics" value="primaryTopic" v-model="primaryTopic"/>
      <q-select :options="secondaryTopics" value="secondaryTopic" v-model="secondaryTopic"/>
      <q-select :options="ternaryTopics" value="ternaryTopic" v-model="ternaryTopic"/>
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
  computed: {
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

      let topics = [{
        label: this.$tc('subtopicsavailable'),
        value: '',
        leftInverted: true
      }]

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

      let secondaryTopic = this.$store.getters['steemqa/topics'][this.primaryTopic][this.secondaryTopic]

      if (!secondaryTopic || secondaryTopic.length === 0) {
        return []
      }

      let topics = [{
        label: this.$tc('subtopicsavailable'),
        value: '',
        leftInverted: true
      }]

      for (let topic of secondaryTopic) {
        topics.push({
          label: topic,
          value: topic
        })
      }

      return topics
    }
  }
}
</script>

<style lang="stylus" scoped>
</script>
