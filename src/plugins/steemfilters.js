export default ({ Vue }) => {
  Vue.filter('sbd', function (value) {
    if (!value) return ''
    return '$' + value.replace('SBD', '')
  })
}
