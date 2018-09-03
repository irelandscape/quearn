<template>
  <div>
    <q-input
      :value="answer" @input="update"
      type="textarea"
      rows=5
      :max-height=5
      stack-label="Compose your answer"
    />
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
