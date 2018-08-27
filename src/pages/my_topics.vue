<template>
  <q-page>
    <q-toolbar
      color="primary"
    >
      <q-toolbar-title>
        <q-icon name="message" outlined />
        {{ $tc('mytopics') }}
      </q-toolbar-title>
      <q-btn size="lg" to="/" >
        <q-icon name="close" outlined>
          <q-tooltip>Back</q-tooltip>
        </q-icon>
      </q-btn>
    </q-toolbar>
    <div class="mytopics">
      <div v-for="(topic, id) in topics" :key=id class="topics">
        <q-checkbox
          @input="checkFavouriteTopic(id)"
          v-model="mytopics"
          :val=id
          :label="topic.topic.topic"
        />
        <div v-for="(subtopic, id) in topic.subtopics" :key=id class="subtopics">
          <q-checkbox
            @input="checkFavouriteTopic(id)"
            v-model="mytopics"
            :val=id
            :label="subtopic.topic.topic"
          />
          <div v-for="(subsubtopic, id) in subtopic.subtopics" :key=id class="subsubtopics">
            <q-checkbox
              @input="checkFavouriteTopic(id)"
              v-model="mytopics"
              :val=id
              :label="subsubtopic.topic.topic"
            />
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>

export default {
  name: 'PageMyTopics',
  data: function () {
    return {
      topics: {},
      mytopics: []
    }
  },
  mounted () {
    let username = this.$store.getters['steem/username']
    let accessToken = this.$store.getters['steem/accessToken']
    let topics = this.$store.getters['steemqa/topics']
    let favouriteTopics = this.$store.getters['steemqa/favouriteTopicsById']

    if (favouriteTopics === null) {
      this.$store.dispatch('steemqa/favouriteTopicsById',
        {
          username,
          accessToken
        })
        .then(response => {
          this.updateTopics()
        })
    }

    if (topics === null) {
      this.$store.dispatch('steemqa/topics')
        .then(response => {
          this.updateTopics()
        })
    }
  },
  methods: {
    updateTopics: function () {
      let topics = this.$store.getters['steemqa/topics']
      let favouriteTopics = this.$store.getters['steemqa/favouriteTopicsById']

      if (topics === null || favouriteTopics === null) {
        return
      }

      let myTopics = {}

      // Reconstruct tree of topics
      for (let topic of topics) {
        if (topic.parent != null) continue
        myTopics[topic.id] = {
          id: topic.id,
          topic: topic,
          subtopics: {}
        }
        // Populate subtopics
        for (let t of topics) {
          if (t.parent !== topic.id) continue
          myTopics[topic.id].subtopics[t.id] = {
            topic: t,
            subtopics: {}
          }

          // Populate sub-subtopics
          for (let t2 of topics) {
            if (t2.parent !== t.id) continue
            myTopics[topic.id].subtopics[t.id].subtopics[t2.id] = {
              topic: t2,
              subtopics: {}
            }
          }
        }
      }
      this.topics = myTopics

      this.mytopics = []
      for (let topic of favouriteTopics) {
        this.mytopics.push(topic[1].topic.toString())
      }
    },
    checkFavouriteTopic: function (id) {
      let username = this.$store.getters['steem/username']
      let accessToken = this.$store.getters['steem/accessToken']

      if (this.mytopics.includes(id)) {
        this.$store.dispatch('steemqa/addTopic', {
          id, username, accessToken
        })
      } else {
        this.$store.dispatch('steemqa/removeTopic', {
          id, username, accessToken
        })
      }
    }
  }
}

</script>

<style lang="stylus" scoped>
  .mytopics
    max-width: 40rem;
    margin: auto;
    padding: 1rem;

  .subtopics
    margin-left: 2rem;

  .subsubtopics
    margin-left: 4rem;
</style>
