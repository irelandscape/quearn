export default ({ Vue }) => {
  Vue.filter('sbd', function (value) {
    if (!value) return ''
    return parseFloat(value).toFixed(2)
  })
}
