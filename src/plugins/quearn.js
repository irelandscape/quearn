export default ({ store, Vue }) => {
  if (process.env.NODE_ENV === 'development') {
    store.commit('quearn/serverURL', 'http://localhost:8000/api')
  } else {
    let isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1

    if (isCordovaApp) {
      store.commit('quearn/serverURL', 'https://www.stemq.io/api')
    } else {
      let url = require('url')
      let q = url.parse(document.location.origin, true)
      store.commit('quearn/serverURL', 'https://' + q.hostname + '/api')
    }
  }
  let xss = require('xss')
  store.commit('quearn/xss', new xss.FilterXSS({
    onTagAttr: function (tag, name, value, isWhiteAttr) {
      if (tag === 'div' && name === 'class') {
        if (value === 'pull-left' || value === 'pull-right' || value === 'text-justify') {
          return 'class="' + value + '"'
        }
      }
    }
  }))
}
