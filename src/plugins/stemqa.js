export default ({ store }) => {
  store.commit('steemqa/serverURL', 'http://localhost:8000')
  store.commit('steemqa/appName', 'StemQA')
}
