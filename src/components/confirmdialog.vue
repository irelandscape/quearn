<template>
  <q-dialog
    v-model="showDialog"
    @cancel="onCancel()"
    @ok="onOk()"
    :title="title"
    prevent-close
  >
    <div slot="body" v-html="body" />
    <template slot="buttons" slot-scope="props">
      <q-btn
        flat
        icon="cancel"
        :label="$tc('cancel')"
        @click="props.cancel" />
      <q-btn
        flat
        icon="done"
        :label="$tc('confirm')"
        @click="props.ok" />
    </template>
  </q-dialog>
</template>

<script>

export default {
  name: 'Confirmdialog',
  data () {
    return {
      title: '',
      body: '',
      showDialog: false,
      okHandler: null,
      cancelHandler: null
    }
  },
  mounted: function () {
    this.$root.$on('confirm_dialog', this.openDialog)
  },
  methods: {
    openDialog: function (title, body, okHandler, cancelHandler) {
      this.title = title
      this.body = body
      this.okHandler = okHandler
      this.cancelHandler = cancelHandler
      this.showDialog = true
    },
    onOk: function () {
      if (this.okHandler) {
        this.okHandler()
      }
    },
    onCancel: function () {
      if (this.cancelHandler) {
        this.cancelHandler()
      }
    }
  }
}

</script>
