import Vue from 'vue'
import Vuex from 'vuex'

// we first import the module
import steem from './steem'
import steemqa from './steemqa'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // then we reference it
    steem,
    steemqa
  }
})

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./steem'], () => {
    const newsteem = require('./steem').default
    store.hotUpdate({ modules: { steem: newsteem } })
  })
}

export default store
