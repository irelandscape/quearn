<template>
  <div>
    <div v-if="horizontal">
      <q-select :options="primaryTopics()" v-model="primaryTopic" @input="primaryChanged" color="amber" inverted-light />
      <q-select :options="secondaryTopics()" v-model="secondaryTopic" @input="secondaryChanged" color="amber" inverted-light />
      <q-select :options="ternaryTopics()" v-model="ternaryTopic" color="amber" inverted-light @input="ternaryChanged "/>
    </div>
    <q-field v-else label-width="2">
      <q-select :options="primaryTopics()" v-model="primaryTopic" @input="primaryChanged"/>
      <q-select :options="secondaryTopics()" v-model="secondaryTopic" @input="secondaryChanged"/>
      <q-select :options="ternaryTopics()" v-model="ternaryTopic" @input="ternaryChanged"/>
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'topicpicker',
  props: {
    tags: null,
    horizontal: {
      type: Boolean,
      default: false
    }
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
        topic = this.$store.getters['quearn/topicStr'](this.ternaryTopic)
      } else if (this.secondaryTopic !== '') {
        topic = this.$store.getters['quearn/topicStr'](this.secondaryTopic)
      } else if (this.primaryTopic !== '') {
        topic = this.$store.getters['quearn/topicStr'](this.primaryTopic)
      }

      return topic.replace(' ', '-').toLowerCase()
    },
    setTopics: function () {
      if (!this.tags) {
        return
      }
      let topics = this.$store.getters['quearn/topicsFromTags'](this.tags)
      if (topics.primary) {
        this.primaryTopic = topics.primary.id
      }
      if (topics.secondary) {
        this.secondaryTopic = topics.secondary.id
      }
      if (topics.ternary) {
        console.log('HEY!')
        this.ternaryTopic = topics.ternary.id
      }
    },
    primaryChanged: function () {
      this.secondaryTopic = ''
      this.$emit('on_topic_changed', this.primaryTopic)
    },
    secondaryChanged: function () {
      this.ternaryTopic = ''
      this.$emit('on_topic_changed', this.secondaryTopic)
    },
    ternaryChanged: function () {
      this.$emit('on_topic_changed', this.ternaryTopic)
    },
    primaryTopics: function () {
      let topics = [{
        label: this.$tc('choosetopic'),
        value: '',
        icon: 'school'
      }]

      for (let topic of this.$store.getters['quearn/topics']) {
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

      for (let topic of this.$store.getters['quearn/topics']) {
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

      for (let topic of this.$store.getters['quearn/topics']) {
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

>>>.q-select
  width: 32%;
  float: left;
  height: 1.5rem;
  margin-right: 0.1rem;
  font-size: 0.8rem;

</style>
