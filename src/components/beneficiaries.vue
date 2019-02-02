<template>
  <span>
    <q-btn
      icon="group_add"
      :color="buttonColor"
      :label="nbrOfBeneficiaries"
      flat
      dense
      @click="beneficiariesDialog = true"
    >
    </q-btn>
    <q-dialog
      v-model="beneficiariesDialog"
      @cancel='onCancel'
      :title="$tc('beneficiaries')"
      v-show=true
      :ok="$tc('save')"
      :cancel=true
      prevent-close
    >
      <div slot="body">
        <div
          v-for="(beneficiary, index) in beneficiaries"
          :key="index"
          class="row items-center">
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
            :float-label="$tc('account')"
            @input="update($event, beneficiary)"
          />
          <q-knob
            v-model="beneficiary.weight"
            :min=0
            :max=10000
            :step=500
            size="3rem"
            :color="knobColor"
            @input="checkWeight($event, beneficiary)"
          >
            {{displayWeight(beneficiary.weight)}} %
          </q-knob>
          <q-btn
            v-if="index == (beneficiaries.length - 1) && index < 7"
            icon="add"
            :color="dialogButtonsColor"
            size="2rem"
            flat
            :disable="!beneficiary.valid || !beneficiary.weight"
            @click="addBeneficiary"
          />
          <q-btn
            v-else
            icon="delete_forever"
            :color="dialogButtonsColor"
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
var debounce = require('debounce')

export default {
  name: 'Beneficiaries',
  props: {
    value: undefined,
    buttonColor: {
      type: String,
      default: 'primary'
    },
    dialogButtonsColor: {
      type: String,
      default: 'primary'
    },
    knobColor: {
      type: String,
      default: 'primary'
    }
  },
  data () {
    return {
      validBeneficiaries: 0,
      beneficiariesDialog: false,
      beneficiaries: [
        {
          account: '',
          weight: 0,
          valid: false
        }
      ]
    }
  },
  computed: {
    nbrOfBeneficiaries: function () {
      return this.$tc('addbeneficiaries') + ' (' + this.validBeneficiaries + ')'
    }
  },
  mounted: function () {
  },
  methods: {
    displayWeight: function (weight) {
      return weight / 100
    },
    addBeneficiary () {
      this.beneficiaries.push({
        account: '',
        weight: 0
      })
    },
    deleteBeneficiary (index) {
      this.beneficiaries.splice(index, 1)
      this.beneficiaries = [...this.beneficiaries]
    },
    getBeneficiaries () {
      let beneficiaries = []

      // Add entries with valid account and non-zero weight
      for (const beneficiary of this.beneficiaries) {
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
    countValidBeneficiaries () {
      let count = 0

      for (const beneficiary of this.beneficiaries) {
        if (beneficiary.valid && beneficiary.weight) {
          ++count
        }
      }

      if (count !== this.validBeneficiaries) {
        this.validBeneficiaries = count
        this.$emit('input', this.getBeneficiaries())
      }

      return count
    },
    update: debounce(function (value, beneficiary) {
      if (value.length < 4) {
        beneficiary.valid = false
        return
      }

      const dsteem = this.$store.getters['steem/dsteem']
      dsteem.database.getAccounts([value]).then(response => {
        if (response.length) {
          beneficiary.valid = true
        } else {
          beneficiary.valid = false
        }
        this.beneficiaries = [...this.beneficiaries]
        this.countValidBeneficiaries()
      })
    }, 300),
    checkWeight: function (value, beneficiary) {
      let max = 10000

      for (const b of this.beneficiaries) {
        if (b !== beneficiary) {
          max -= b.weight
        }
      }

      beneficiary.weight = Math.min(beneficiary.weight, max)
      this.countValidBeneficiaries()
    },
    onCancel () {
      this.beneficiaries = [
        {
          account: '',
          weight: 0,
          valid: false
        }
      ]
      this.countValidBeneficiaries()
    }
  }
}
</script>
