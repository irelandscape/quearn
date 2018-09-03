import axios from 'axios'

export default ({ store }) => {
  store.commit('steemqa/serverURL', 'http://127.0.0.1:8000')
  axios.get(store.getters['steemqa/serverURL'] + '/configs').then(
    function (response) {
      store.commit('steemqa/config', response.data[0])
    }).catch(
    function (error) {
      console.log(error)
      this.$q.notify('Failed to contact API Server')
    })
  axios.get(store.getters['steemqa/serverURL'] + '/topics').then(
    function (response) {
      store.commit('steemqa/topics', response.data)
    }).catch(
    function (error) {
      console.log(error)
      this.$q.notify('Failed to contact API Server')
    })
}
