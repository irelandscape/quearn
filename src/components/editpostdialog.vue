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
        label-width="2"
      >
        <q-input
          :float-label="$t('questionrequirement')"
          v-model="blog.title"
          type="text"
          :error="$v.blog.title.$error"
        />
      </q-field>
      <div v-if="!info.iscomment">
        <topicpicker ref="topicpicker"
          :tags="tags"
        />
        <q-field
          label-width="2"
        >
          <q-chips-input
            :float-label="$t('requesttags')"
            v-model="additionalTags"
          />
        </q-field>

      </div>
      <q-field
        label-width="2"
      >
        <q-input
          v-model="blog.body"
          type="textarea"
          rows=7
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
      additionalTags: [],
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
      let metadata = JSON.parse(this.blog.json_metadata)
      this.additionalTags = []
      for (let tag of metadata.tags) {
        if (tag === 'stemq' || this.$store.getters['quearn/topicByName'](tag)) {
          continue
        }
        this.additionalTags.push(tag)
      }
    },
    cancelEdit: function () {
      this.blog.title = this.originalTitle
      this.blog.body = this.originalBody
      if (this.info.callback) {
        this.info.callback(this.info.callbackContext)
      }
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
        tags = tags.concat(this.additionalTags)

        this.$q.loading.show({
          message: this.$tc('updating')
        })

        steem.editPost(this.$store.getters['steem/client'],
          this.$store.getters['steem/username'],
          this.$store.getters['quearn/config'],
          this.blog.permlink,
          this.blog.title,
          tags,
          this.blog.body,
          this.$store.getters['quearn/config'].appName + '/' + this.$store.getters['quearn/release']).then(() => {
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
          this.$store.getters['quearn/config'],
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
