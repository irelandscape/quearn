<template>
  <q-tab-pane name="tab-topics">
    <q-toolbar
      color="primary"
    >
      <q-toolbar-title>
        <topicpicker
          ref="topicpicker"
          :horizontal=true
          @on_topic_changed="onTopicChanged"
        />
        <div style="clear: both;" />
        <q-btn-group style="clear: both;">
          <q-btn
            icon="access_time"
            :label="$tc('latest')"
            dense
            :push="category==='latest'"
            @click="onSortBtnClicked('latest')"
          />
          <q-btn
            icon="star"
            :label="$tc('best')"
            dense
            :push="category==='best'"
            @click="onSortBtnClicked('best')"
          />
          <q-btn
            icon="priority_high"
            :label="$tc('unanswered')"
            dense
            :push="category==='unanswered'"
            @click="onSortBtnClicked('unanswered')"
          />
        </q-btn-group>
      </q-toolbar-title>
    </q-toolbar>

    <steemcardgrid
      :filters="filters"
    />
  </q-tab-pane>
</template>

<script>
import topicpicker from 'components/topicpicker'
import Steemcardgrid from 'components/steemcardgrid'

export default {
  name: 'Tabtopics',
  components: {
    topicpicker,
    Steemcardgrid
  },
  data: function () {
    return {
      category: 'latest',
      filters: {
        ordering: '-created'
      }
    }
  },
  methods: {
    onSortBtnClicked: function (category) {
      this.category = category
      if (category === 'latest') {
        this.filters = {
          ordering: '-created'
        }
      } else if (category === 'best') {
        this.filters = {
          ordering: '-net_votes'
        }
      } else if (category === 'unanswered') {
        this.filters = {
          ordering: '-net_votes',
          answer_count: 0
        }
      }
    },
    onTopicChanged: function (topic) {
      this.filters['topic'] = topic
      this.filters = {...this.filters}
    }
  }
}

</script>

<style lang="stylus" scoped>

.q-tab-pane
  padding: 0;
  border: 0;

.q-toolbar-title
  padding: 0;

.q-btn-group
  clear: both;

.q-btn-push
  color: orange;

</style>
