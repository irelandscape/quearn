export default ({ Vue }) => {
  Vue.filter('sbd', function (value) {
    if (!value) return ''
    return parseFloat(value).toFixed(2)
  })

  Vue.filter('timestamp', function (value) {
    let d = new Date(value)
    return d.toLocaleString()
  })

  Vue.filter('stripA', function (value) {
    return value.replace('A:', '')
  })
}
