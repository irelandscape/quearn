<template>
  <div>
    <q-input
      :value="answer" @input="update"
      type="textarea"
      rows=5
      :max-height=5
      stack-label="Compose your answer"
    />
    <topicpicker :tags="tags" />
    <q-field icon="label" label="Tag 2" >
      <q-input type="text" value="" v-model="answer.tag2"/>
    </q-field>
    <q-field icon="label" label="Tag 3" >
      <q-input type="text" value="" v-model="answer.tag3"/>
    </q-field>
    <q-field icon="label" label="Tag 4" >
      <q-input type="text" value="" v-model="answer.tag4"/>
    </q-field>
    <q-btn-group class="q-mt-md">
      <q-btn
        color="secondary"
        icon="send"
        :label="$t('submit')"
        v-model="form.body"
        @click="submit"
      />
      <q-btn
        color="secondary"
        icon="cancel"
        :label="$t('cancel')"
        @click="cancel"
      />
    </q-btn-group>
    <div class="preview q-mb-lg q-mt-md" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import topicpicker from 'components/topicpicker'

var debounce = require('debounce')

export default {
  name: 'Editanswer',
  data () {
    return {
      answer: '',
      form: {
        body: ''
      }
    }
  },
  props: {
    tags: null
  },
  components: {
    topicpicker
  },
  validations: {
    form: {
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
      return md.render(this.answer)
    }
  },
  methods: {
    update: debounce(function (value) {
      this.answer = value
    }, 300),
    submit () {
    },
    cancel () {
      this.$emit('answercompleted')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .q-input
    border: 1px solid #cccccc;

  .preview
    border: 1px solid #cccccc;
</style>
