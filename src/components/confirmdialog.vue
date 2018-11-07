<template>
  <q-dialog
    v-model="showDialog"
    :ok="ok"
    :cancel="cancel"
    @cancel="onCancel()"
    @ok="onOk()"
    :title="title"
    prevent-close
  >
    <div slot="body">
      <q-icon
        v-if="icon"
        :name="icon"
        size="5rem"
        :color="iconcolor" />
      <div v-html="body" />
    </div>
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
      cancelHandler: null,
      ok: true,
      cancel: true,
      icon: null,
      iconcolor: 'secondary'
    }
  },
  mounted: function () {
    this.$root.$on('confirm_dialog', this.openDialog)
  },
  methods: {
    openDialog: function (title, body, okHandler, cancelHandler, okLabel, cancelLabel, icon, iconcolor) {
      this.title = title
      this.body = body
      this.okHandler = okHandler
      this.cancelHandler = cancelHandler
      this.showDialog = true
      this.icon = icon
      if (iconcolor) {
        this.iconcolor = iconcolor
      }

      if (okLabel) {
        this.ok = okLabel
      }
      if (cancelLabel) {
        this.cancel = cancelLabel
      }
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

<style lang="stylus" scoped>
  .q-icon
    float: left;

  >>> br
    font-size: 150%;
</style>
