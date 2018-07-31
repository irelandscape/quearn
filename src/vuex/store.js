// store.js

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// the root, initial state object
const state = {
}

// define the possible mutations that can be applied to our state
const mutations = {

}

// create the Vuex instance by combining the state and mutations objects
// then export the Vuex store for use by our components
export default new Vuex.Store({
  state,
  mutations
})
