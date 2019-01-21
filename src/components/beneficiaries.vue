<template>
  <span>
    <q-btn
      icon="group_add"
      color="secondary"
      :label="nbrOfBeneficiaries"
      flat
      dense
      @click="beneficiariesDialog = true"
    >
    </q-btn>
    <q-dialog
      v-model="beneficiariesDialog"
      @ok='onOK'
      @cancel='onCancel'
      :title="$tc('beneficiaries')"
      v-show=true
      :ok="$tc('save')"
      :cancel=true
      prevent-close
    >
      <div slot="body">
        <div
          v-for="(beneficiary, index) in form.beneficiaries"
          :key="index"
          class="row no-wrap items-center">
          <span v-if="beneficiary.account.length >= 4">
            <q-icon
              v-if="beneficiary.valid"
              name="done"
              size="2rem"
              color="green" />
            <q-icon
              v-if="!beneficiary.valid"
              name="clear"
              size="2rem"
              color="red" />
          </span>
          <span v-else style="width: 2rem;"/>
          <q-input
            style="height: 3rem;"
            type="text"
            v-model="beneficiary.account"
            :error="$v.form.beneficiaries.$error"
            :float-label="$tc('account')"
            @input="update($event, beneficiary)"
          />
          <q-knob
            v-model="beneficiary.weight"
            :min=0
            :max=10000
            :step=500
            size="3rem"
            color="secondary"
            @input="checkWeight($event, beneficiary)"
          >
            {{displayWeight(beneficiary.weight)}} %
          </q-knob>
          <q-btn
            v-if="index == (form.beneficiaries.length - 1) && index < 7"
            icon="add"
            color="secondary"
            size="2rem"
            flat
            :disable="!beneficiary.valid || !beneficiary.weight"
            @click="addBeneficiary"
          />
          <q-btn
            v-else
            icon="delete_forever"
            color="secondary"
            size="2rem"
            flat
            @click="deleteBeneficiary(index)"
          />
        </div>
      </div>
    </q-dialog>
  </span>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
var debounce = require('debounce')

export default {
  name: 'Beneficiaries',
  props: {
  },
  data () {
    return {
      beneficiariesDialog: false,
      form: {
        beneficiaries: [
          {
            account: '',
            weight: 0,
            valid: false
          }
        ]
      }
    }
  },
  computed: {
    nbrOfBeneficiaries: function () {
      let count = 0

      for (let beneficiary of this.form.beneficiaries) {
        if (beneficiary.valid && beneficiary.weight) {
          ++count
        }
      }
      return this.$tc('addbeneficiaries') + ' (' + count + ')'
    }
  },
  validations () {
    let form = {
      form: {
        beneficiaries: {
          required
        }
      }
    }
    return form
  },
  mounted: function () {
  },
  methods: {
    displayWeight: function (weight) {
      return weight / 100
    },
    addBeneficiary () {
      this.form.beneficiaries.push({
        account: '',
        weight: 0
      })
    },
    deleteBeneficiary (index) {
      this.form.beneficiaries.splice(index, 1)
      this.form.beneficiaries = [...this.form.beneficiaries]
    },
    getBeneficiaries () {
      let beneficiaries = []

      // Add entries with valid account and non-zero weight
      for (let beneficiary of this.form.beneficiaries) {
        if (beneficiary.valid && beneficiary.weight) {
          beneficiaries.push({
            account: beneficiary.account,
            weight: beneficiary.weight
          })
        }
      }

      // Steem requires beneficiaries sorted by account
      return beneficiaries.sort(function (a, b) {
        return a.account.localeCompare(b.account)
      })
    },
    update: debounce(function (value, beneficiary) {
      if (value.length < 4) {
        beneficiary.valid = false
        return
      }

      let dsteem = this.$store.getters['steem/dsteem']
      dsteem.database.getAccounts([value]).then(response => {
        if (response.length) {
          beneficiary.valid = true
        } else {
          beneficiary.valid = false
        }
        this.form.beneficiaries = [...this.form.beneficiaries]
      })
    }, 300),
    checkWeight: function (value, beneficiary) {
      let max = 10000

      for (let b of this.form.beneficiaries) {
        if (b !== beneficiary) {
          max -= b.weight
        }
      }

      beneficiary.weight = Math.min(beneficiary.weight, max)
    },
    onOK (data) {
    },
    onCancel () {
      this.form.beneficiaries = [
        {
          account: '',
          weight: 0,
          valid: false
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
  .modal-body
    padding: 2rem;

  .q-btn
    color: #666666;
    margin-right: 0.2rem;
    padding-top: 0;
    padding-bottom: 0;

</style>
