<template>
  <q-dialog
    v-if="blog"
    v-model="editpost"
    @cancel="cancelEdit()"
    @ok="validateEdit()"
    :title="title()"
    ok='Submit'
    :cancel=true
    prevent-close
    position='right'
  >
    <div slot="body" class="mydialog">
      <q-field
        v-if="!info.iscomment"
        icon="title"
        :helper="$t('questionrequirement')"
      >
        <q-input
          v-model="blog.title"
          type="text"
          :error="$v.blog.title.$error"
        />
      </q-field>
      <div v-if="!info.iscomment">
        <topicpicker ref="topicpicker"
          :tags="tags"
        />

        <q-field icon="label" label="Tag 2" >
          <q-input type="text" value="" v-model="blog.tag2"/>
        </q-field>
        <q-field icon="label" label="Tag 3" >
          <q-input type="text" value="" v-model="blog.tag3"/>
        </q-field>
        <q-field icon="label" label="Tag 4" >
          <q-input type="text" value="" v-model="blog.tag4"/>
        </q-field>
      </div>

      <q-field
        icon="notes"
      >
        <q-input
          v-model="blog.body"
          type="textarea"
          rows=20
          stack-label="Edit your content"
        />
      </q-field>
    </div>
  </q-dialog>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import topicpicker from 'components/topicpicker'
import * as steem from 'components/utils/steem'

const mustBeQuestion = (value) => value.trim().slice(-1) === '?'

export default {
  name: 'Editpostdialog',
  data () {
    return {
      editpost: false,
      blog: null,
      info: {
        title: this.$tc('edit'),
        callback: null,
        callbackContext: null,
        iscomment: false,
        parentAuthor: '',
        parentPermlink: ''
      }
    }
  },
  components: {
    topicpicker
  },
  validations () {
    let blog = {
      blog: {
        body: {
          required
        }
      }
    }
    if (!this.info.iscomment) {
      blog.blog['title'] = {
        required,
        maxLength: maxLength(128),
        mustBeQuestion
      }
    }

    return blog
  },
  mounted: function () {
    this.$root.$on('edit_post', this.onEditPost)
  },
  methods: {
    onEditPost: function (blog, info = {iscomment: false}) {
      this.blog = blog
      if (!info.iscomment) {
        this.originalTitle = this.blog.title
      }
      this.originalBody = this.blog.body
      this.editpost = true
      this.info = info
    },
    cancelEdit: function () {
      this.blog.title = this.originalTitle
      this.blog.body = this.originalBody
      this.info.callback(this.info.callbackContext)
    },
    validateEdit: function () {
      this.$v.blog.$touch()

      if (this.$v.blog.$error) {
        this.$q.notify('Please review fields again')
        this.editpost = true
      }

      if (!this.info.iscomment) {
        let tags = []
        tags.push(this.$refs.topicpicker.selectTopicToTag())
        if (this.blog.tag2) {
          tags.push(this.blog.tag2)
        }
        if (this.blog.tag3) {
          tags.push(this.blog.tag3)
        }
        if (this.blog.tag4) {
          tags.push(this.blog.tag4)
        }

        this.$q.loading.show({
          message: this.$tc('updating')
        })

        steem.editPost(this.$store.getters['steem/client'],
          this.$store.getters['steem/username'],
          this.$store.getters['steemqa/config'],
          this.blog.permlink,
          this.blog.title,
          tags,
          this.blog.body).then(() => {
          this.$q.loading.hide()
          this.$q.notify({
            message: this.$t('editsuccessfull'),
            type: 'positive'
          })
        }).catch((err) => {
          this.$q.notify({
            message: this.$tc('editfailure'),
            detail: err.error_description,
            type: 'negative'
          })
          this.blog.title = this.originalTitle
          this.blog.body = this.originalBody
          this.$q.loading.hide()
        })
      } else {
        steem.editComment(this.$store.getters['steem/client'],
          this.info.parentAuthor,
          this.info.parentPermlink,
          this.$store.getters['steemqa/config'],
          this.$store.getters['steem/username'],
          this.blog.permlink,
          this.blog.body).then(() => {
          this.$q.loading.hide()
          this.$q.notify({
            message: this.$t('editsuccessfull'),
            type: 'positive'
          })
          this.info.callback(this.info.callbackContext)
        }).catch((err) => {
          this.$q.notify({
            message: this.$tc('editfailure'),
            detail: err.error_description,
            type: 'negative'
          })
          this.blog.title = this.originalTitle
          this.blog.body = this.originalBody
          this.$q.loading.hide()
        })
      }
    },
    title: function () {
      return this.info.title
    }
  },
  computed: {
    tags: function () {
      let metadata = JSON.parse(this.blog.json_metadata)
      return metadata.tags
    }
  }
}

</script>

<style lang="stylus" scoped>
  .mydialog
    width: 25rem;
</style>
