<template>
  <div>
    <q-field
      v-if="isquestion"
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

    <topicpicker
      ref="topicpicker"
      :tags="tags"
    />

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
      <q-btn
        color="primary"
        icon="cancel"
        :label="$t('cancel')"
        @click="cancel"
      />
    </q-field>
    <strong>Preview</strong>
    <div class="blog" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import topicpicker from 'components/topicpicker'
import axios from 'axios'
import { required, maxLength } from 'vuelidate/lib/validators'

var debounce = require('debounce')

const mustBeQuestion = (value) => value.trim().slice(-1) === '?'

export default {
  name: 'Editblog',
  components: {
    topicpicker
  },
  props: {
    isquestion: false,
    tags: null,
    question_title: '',
    question_author: '',
    question_permlink: ''
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
  validations () {
    let form = {
      form: {
        body: {
          required
        }
      }
    }

    if (this.isquestion) {
      form.form['title'] = {
        required,
        maxLength: maxLength(128),
        mustBeQuestion
      }
    }

    return form
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

      if (!this.isquestion) {
        this.form.title = 'A: ' + this.question_title
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
        let url = this.$store.getters['steemqa/serverURL']
        if (this.isquestion) {
          url += '/newquestion'
        } else {
          url += '/newanswer'
        }

        let params = {
          username: this.$store.getters['steem/username'],
          access_token: this.$store.getters['steem/accessToken'],
          permlink: permlink,
          title: this.form.title,
          tags: tags
        }

        if (!this.isquestion) {
          params['question_author'] = this.question_author
          params['question_permlink'] = this.question_permlink
        }

        axios.post(
          url,
          params
        ).then((response) => {
          this.$q.loading.hide()
          this.$q.notify({
            message: this.$tc('postingsusccess'),
            type: 'positive'
          })
          this.$emit('editcompleted')
        }).catch((err) => {
          this.$q.notify({
            message: this.$tc('postingfailed'),
            detail: err.error_description,
            type: 'negative'
          })
          this.$q.loading.hide()
          this.$emit('editcompleted')
        })
        this.$q.loading.hide()
      }).catch((err) => {
        this.$q.notify({
          message: this.$tc('postingfailed'),
          detail: err.error_description,
          type: 'negative'
        })
        this.$q.loading.hide()
        this.$emit('editcompleted')
      })
    },
    cancel () {
      this.$emit('editcompleted')
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
