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
    submitPost: (vue) => {
      let tag1 = ''
      if (vue.$refs.topicpicker.ternaryTopic !== '') {
        tag1 = vue.topicStr(vue.$store.getters['quearn/topics'],
          vue.$refs.topicpicker.ternaryTopic)
      } else if (vue.$refs.topicpicker.secondaryTopic !== '') {
        tag1 = vue.topicStr(vue.$store.getters['quearn/topics'],
          vue.$refs.topicpicker.secondaryTopic)
      } else if (vue.$refs.topicpicker.primaryTopic !== '') {
        tag1 = vue.topicStr(vue.$store.getters['quearn/topics'],
          vue.$refs.topicpicker.primaryTopic)
      }

      if (!vue.isquestion) {
        vue.form.title = 'A: ' + vue.question_title
      }

      let permlink = vue.permlink(vue.form.title)
      let tags = [vue.$store.getters['quearn/config'].tag]
      tags.push(tag1)
      if (vue.form.tag2) {
        tags.push(vue.form.tag2)
      }
      if (vue.form.tag3) {
        tags.push(vue.form.tag3)
      }
      if (vue.form.tag4) {
        tags.push(vue.form.tag4)
      }

      vue.$q.loading.show({
        message: vue.$tc('postingnewquestion')
      })

      let body = vue.form.body
      if (vue.$store.getters['quearn/config'].post_addon_msg.length) {
        body += '\n\n' + vue.$store.getters['quearn/config'].post_addon_msg
      }

      vue.$store.getters['steem/client'].comment(
        '',
        vue.$store.getters['quearn/config'].tag,
        vue.$store.getters['steem/username'],
        permlink,
        vue.form.title,
        body,
        {
          tags: tags,
          app: vue.$store.getters['quearn/config'].appName + '/' + vue.$store.getters['quearn/release']
        }
      ).then(() => {
        let url = vue.$store.getters['quearn/serverURL']
        if (vue.isquestion) {
          url += '/newquestion'
        } else {
          url += '/newanswer'
        }

        let params = {
          username: vue.$store.getters['steem/username'],
          access_token: vue.$store.getters['steem/accessToken'],
          permlink: permlink,
          title: vue.form.title,
          tags: tags
        }

        if (!vue.isquestion) {
          params['question_author'] = vue.question_author
          params['question_permlink'] = vue.question_permlink
        }

        axios.post(
          url,
          params
        ).then((response) => {
          vue.$q.loading.hide()
          vue.$q.notify({
            message: vue.$tc('postingsuccess'),
            type: 'positive'
          })
          if (vue.emit_editcompleted) {
            vue.$emit('editcompleted', true)
          } else {
            vue.$router.push('/')
          }
        }).catch((err) => {
          vue.$q.notify({
            message: vue.$tc('postingfailed'),
            detail: err.error_description,
            type: 'negative'
          })
          vue.$q.loading.hide()
          if (vue.emit_editcompleted) {
            vue.$emit('editcompleted', false)
          } else {
            vue.$router.push('/')
          }
        })
        vue.$q.loading.hide()
      }).catch((err) => {
        vue.$q.notify({
          message: vue.$tc('postingfailed'),
          detail: err.error_description,
          type: 'negative'
        })
        vue.$q.loading.hide()
        if (vue.emit_editcompleted) {
          vue.$emit('editcompleted', false)
        } else {
          vue.$router.push('/')
        }
      })
    },
    submit () {
      this.$v.form.$touch()

      if (this.$v.form.$error) {
        this.$q.notify('Please review fields again')
        return
      }

      let images = this.form.body.match('https?://.*?\\.(?:png|jpe?g|gif)')
      if (images !== null && images.length > 0) {
        this.submitPost(this)
      } else {
        this.$root.$emit('confirm_dialog',
          this.$tc('noimagewarning'),
          this.$tc('noimagewarningdetails'),
          () => {
            this.submitPost(this)
          },
          undefined,
          this.$tc('yesimsure'),
          this.$tc('woopsiforgot'),
          'warning',
          'warning')
      }
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
      this.input = form.body
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/css/blog.styl"

</style>
