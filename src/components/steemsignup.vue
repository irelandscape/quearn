<template>
  <div>
    <q-btn
      @click="signup()"
      :label = "$t('signup')"
    >
    </q-btn>
    <q-dialog
      v-model="showDialog"
      :ok=false
      :cancel="$t('cancel')"
      :title="$t('createaccount')"
      prevent-close
    >
      <div slot="body">
        <div v-html="$t('createaccountoptions')" class="q-mb-lg" />
        <div class="row">
          <div class="col-3">
            <!--
            <q-chip
              class="ninja-widget"
              :data-referrer="this.$store.getters['quearn/config'].steem_ninja_referrer"
              :data-image="this.$store.getters['quearn/config'].small_logo"
              data-name="Oracle-D"
              title="Register a Steem account"
              avatar="https://steemitimages.com/u/steem.ninja/avatar"
              @click="signupWithSteemNinja"
              style="cursor: pointer;"
            >
              Steem.Ninja
            </q-chip>
            -->
            <a
              href="https://widget.steem.ninja/widget.html?referrer=stemq"
            >
              <img src="https://i.postimg.cc/Bnc2Zv4b/steemninja.png"
                title="Instant Steem account creation ($2.5)"
                data-name=""
                :data-referrer="this.$store.getters['quearn/config'].steem_ninja_referrer"
                :data-image="this.$store.getters['quearn/config'].small_logo"
                class="ninja-widget"
              />
            </a>
          </div>
          <p class="col-9">
            <strong>Cost $2.5</strong> - Instant account creation and 15 SP delegation for 90 days.
          </p>
        </div>

        <div class="row">
          <div class="col-3">
            <q-chip
              avatar="/statics/steemit.svg"
              @click="signupWithSteemit"
              style="cursor: pointer;"
            >
              Steemit
            </q-chip>
          </div>
          <p class="col-9">
            <strong>Free</strong> - Takes up to two weeks.
          </p>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'SteemSignup',
  data () {
    return {
      showDialog: false
    }
  },
  methods: {
    signup () {
      this.showDialog = true
    },
    signupWithSteemNinja () {
      this.showDialog = false
    },
    signupWithSteemit () {
      document.location = 'https://signup.steemit.com/?ref=' + this.$store.getters['quearn/config'].appName
    }
  },
  mounted: function () {
    const event = new CustomEvent('DOMContentLoaded')
    document.dispatchEvent(event)
  }
}
</script>

<style lang="stylus" scoped>
</style>
