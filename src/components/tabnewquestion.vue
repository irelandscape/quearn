<template>
  <q-tab-pane name="tab-newquestion">
    <q-field
      icon="title"
      label="Title"
      :helper="$t('questionrequirement')"
    >
      <q-input
        type="text"
        v-model="form.title"
        :error="$v.form.title.$error"
      />
    </q-field>

    <topicpicker ref="topicpicker" />

    <q-field icon="label" label="Tag 2" >
      <q-input type="text" value="" v-model="form.tag2"/>
    </q-field>
    <q-field icon="label" label="Tag 3" >
      <q-input type="text" value="" v-model="form.tag3"/>
    </q-field>
    <q-field icon="label" label="Tag 4" >
      <q-input type="text" value="" v-model="form.tag4"/>
    </q-field>

    <q-field
      icon="notes"
      label="Description"
      :helper="$t('questionelaborate')"
    >
      <q-input
        type="textarea"
        :value="input" @input="update"
        v-model="form.body"
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
        @click="submit"
        :disabled="$v.$invalid"
      />
    </q-field>

    <strong>Preview</strong>
    <div class="blog" v-html="compiledMarkdown"></div>
  </q-tab-pane>
</template>

<script>

import topicpicker from 'components/topicpicker'
import axios from 'axios'
import { required, maxLength } from 'vuelidate/lib/validators'

var debounce = require('debounce')

const mustBeQuestion = (value) => value.trim().slice(-1) === '?'

export default {
  name: 'TabNewQuestion',
  components: {
    topicpicker
  },
  data: function () {
    return {
      text: '',
      input: '',
      form: {
        title: ''
      }
    }
  },
  validations: {
    form: {
      title: {
        required,
        maxLength: maxLength(128),
        mustBeQuestion
      },
      body: {
        required
      }
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
    }, 300),
    permlink: (str) => {
      return str.replace(/[^a-z0-9]+/gi, '-')
        . replace(/^-*|-*$/g, '')
        .toLowerCase()
    },
    topicStr: (topics, id) => {
      for (let topic of topics) {
        if (topic.id === id) {
          return topic.topic
        }
      }
      return ''
    },
    submit () {
      this.$v.form.$touch()

      if (this.$v.form.$error) {
        this.$q.notify('Please review fields again')
        return
      }

      let tag1 = ''
      if (this.$refs.topicpicker.ternaryTopic !== '') {
        tag1 = this.topicStr(this.$store.getters['steemqa/topics'],
          this.$refs.topicpicker.ternaryTopic)
      } else if (this.$refs.topicpicker.secondaryTopic !== '') {
        tag1 = this.topicStr(this.$store.getters['steemqa/topics'],
          this.$refs.topicpicker.secondaryTopic)
      } else if (this.$refs.topicpicker.primaryTopic !== '') {
        tag1 = this.topicStr(this.$store.getters['steemqa/topics'],
          this.$refs.topicpicker.primaryTopic)
      }

      let permlink = this.permlink(this.form.title)
      let tags = [this.$store.getters['steemqa/config'].tag]
      tags.push(tag1)
      if (this.form.tag2) {
        tags.push(this.form.tag2)
      }
      if (this.form.tag3) {
        tags.push(this.form.tag3)
      }
      if (this.form.tag4) {
        tags.push(this.form.tag4)
      }

      this.$q.loading.show({
        message: this.$tc('postingnewquestion')
      })

      this.$store.getters['steem/client'].comment(
        '',
        this.$store.getters['steemqa/config'].tag,
        this.$store.getters['steem/username'],
        permlink,
        this.form.title,
        this.form.body,
        {
          tags: tags
        }
      ).then(() => {
        axios.post(
          this.$store.getters['steemqa/serverURL'] + '/newquestion',
          {
            username: this.$store.getters['steem/username'],
            access_token: this.$store.getters['steem/accessToken'],
            permlink: permlink
          }
        ).then((response) => {
          this.$q.loading.hide()
          this.$q.notify({
            message: 'Question successfully posted!',
            type: 'positive'
          })
          this.$router.go(-1)
        }).catch((err) => {
          this.$q.notify({
            message: this.$tc('postingnewquestion'),
            detail: err.error_description,
            type: 'negative'
          })
          this.$q.loading.hide()
        })
        this.$q.loading.hide()
      }).catch((err) => {
        this.$q.notify({
          message: this.$tc('postingfailed'),
          detail: err.error_description,
          type: 'negative'
        })
        this.$q.loading.hide()
      })
    }
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
