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
        :max-height=200
      />
    </q-field>

    <q-field
      inset="full"
    >
      <q-btn
        color="primary"
        icon="send"
        flat
        :label="$t('submit')"
        @click="submit"
        :disabled="$v.$invalid"
      />
      <q-btn
        color="primary"
        icon="cancel"
        flat
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
import { md2html } from 'components/utils/markdown'

var debounce = require('debounce')

const mustBeQuestion = (value) => value.trim().slice(-1) === '?'

export default {
  name: 'Editblog',
  components: {
    topicpicker
  },
  props: {
    isquestion: {
      type: Boolean,
      default: false
    },
    tags: null,
    question_title: '',
    question_author: '',
    question_permlink: '',
    emit_editcompleted: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      text: '',
      input: '',
      form: {}
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
    selectedTopic () {
      let tag1 = ''
      if (this.$refs.topicpicker.ternaryTopic !== '') {
        tag1 = this.topicStr(this.$store.getters['quearn/topics'],
          this.$refs.topicpicker.ternaryTopic)
      } else if (this.$refs.topicpicker.secondaryTopic !== '') {
        tag1 = this.topicStr(this.$store.getters['quearn/topics'],
          this.$refs.topicpicker.secondaryTopic)
      } else if (this.$refs.topicpicker.primaryTopic !== '') {
        tag1 = this.topicStr(this.$store.getters['quearn/topics'],
          this.$refs.topicpicker.primaryTopic)
      }

      return tag1
    },
    resetForm () {
      this.form = {}
      this.$refs.topicpicker.primaryTopic = ''
      this.$refs.topicpicker.secondaryTopic = ''
      this.$refs.topicpicker.ternaryTopic = ''
    },
    submit () {
      this.$v.form.$touch()

      if (this.$v.form.$error) {
        this.$q.notify('Please review fields again')
        return
      }

      let tag1 = this.selectedTopic()

      if (!this.isquestion) {
        this.form.title = 'A: ' + this.question_title
      }

      let permlink = this.permlink(this.form.title)
      let tags = [this.$store.getters['quearn/config'].tag]
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

      let body = this.form.body
      if (this.$store.getters['quearn/config'].post_addon_msg.length) {
        body += '\n\n' + this.$store.getters['quearn/config'].post_addon_msg
      }

      this.$store.getters['steem/client'].comment(
        '',
        this.$store.getters['quearn/config'].tag,
        this.$store.getters['steem/username'],
        permlink,
        this.form.title,
        body,
        {
          tags: tags
        }
      ).then(() => {
        let url = this.$store.getters['quearn/serverURL']
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
          this.resetForm()
          this.$q.loading.hide()
          this.$q.notify({
            message: this.$tc('postingsuccess'),
            type: 'positive'
          })
          if (this.emit_editcompleted) {
            this.$emit('editcompleted', true)
          } else {
            this.$router.push('/')
          }
        }).catch((err) => {
          this.$q.notify({
            message: this.$tc('postingfailed'),
            detail: err.error_description,
            type: 'negative'
          })
          this.$q.loading.hide()
          if (this.emit_editcompleted) {
            this.$emit('editcompleted', false)
          } else {
            this.$router.push('/')
          }
        })
        this.$q.loading.hide()
      }).catch((err) => {
        this.$q.notify({
          message: this.$tc('postingfailed'),
          detail: err.error_description,
          type: 'negative'
        })
        this.$q.loading.hide()
        if (this.emit_editcompleted) {
          this.$emit('editcompleted', false)
        } else {
          this.$router.push('/')
        }
      })
    },
    cancel () {
      this.resetForm()
      if (this.emit_editcompleted) {
        this.$emit('editcompleted', false)
      } else {
        this.$router.push('/')
      }
    }
  },
  computed: {
    compiledMarkdown: function () {
      return md2html(this.input,
        this.$store.getters['quearn/xss'],
        this.$store.getters['quearn/config'].post_addon_msg)
    }
  },
  beforeDestroy: function () {
    if (this.isquestion) {
      this.$q.localStorage.set('questioneditblogform', this.form)
      this.$q.localStorage.set('questionprimaryTopic', this.$refs.topicpicker.primaryTopic)
      this.$q.localStorage.set('questionsecondaryTopic', this.$refs.topicpicker.secondaryTopic)
      this.$q.localStorage.set('questionternaryTopic', this.$refs.topicpicker.ternaryTopic)
    } else {
      this.$q.localStorage.set('answereditblogform', this.form)
      this.$q.localStorage.set('answerprimaryTopic', this.$refs.topicpicker.primaryTopic)
      this.$q.localStorage.set('answersecondaryTopic', this.$refs.topicpicker.secondaryTopic)
      this.$q.localStorage.set('answerternaryTopic', this.$refs.topicpicker.ternaryTopic)
    }
  },
  mounted: function () {
    let form = null
    if (this.isquestion) {
      form = this.$q.localStorage.get.item('questioneditblogform')
      this.$refs.topicpicker.primaryTopic = this.$q.localStorage.get.item('questionprimaryTopic')
      this.$refs.topicpicker.secondaryTopic = this.$q.localStorage.get.item('questionsecondaryTopic')
      this.$refs.topicpicker.ternaryTopic = this.$q.localStorage.get.item('questionternaryTopic')
    } else {
      form = this.$q.localStorage.get.item('answereditblogform')
      this.$refs.topicpicker.primaryTopic = this.$q.localStorage.get.item('answerprimaryTopic')
      this.$refs.topicpicker.secondaryTopic = this.$q.localStorage.get.item('answersecondaryTopic')
      this.$refs.topicpicker.ternaryTopic = this.$q.localStorage.get.item('answerternaryTopic')
    }

    if (form) {
      this.form = form
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

</style>
