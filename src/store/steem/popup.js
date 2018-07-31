/**
 * Based on: https://github.com/lapwinglabs/oauth-open
 * @TODO refactor internal methods for better dependency implementations (like querystring).
 */
/**
 * Module dependencies
 */
import querystring from 'querystring'
import { get, attempt, assign } from 'lodash-es'

/**
 * Initialize `open`
 */

function open (url, options, fn) {
  options = options || {}

  if (arguments.length === 2) {
    fn = options
    options = {}
  }

  let str = stringify(configure(options))
  let popup = window.open(url, options.name || '', str)

  return new Promise((resolve, reject) => {
    return poll(popup, resolve, reject)
  })
  // popup.focus()
  // poll(popup, fn)
  // return popup
}

/**
 * Poll
 */

function poll (popup, resolve, reject) {
  // let done = once(fn)

  let intervalId = setInterval(function polling () {
    if (popup.closed) {
      clearInterval(intervalId)
      return reject(new Error('closed'))
    }
    const { documentOrigin, popupWindowOrigin } = attempt(() => {
      try {
        const doc = get(document, 'location.host')
        const pop = get(popup, 'location.host')
        return { documentOrigin: doc, popupWindowOrigin: pop }
      } catch (e) {
        return { documentOrigin: null, popupWindowOrigin: null }
      }
    })

    if (!documentOrigin || !popupWindowOrigin) {
      // console.log('no origin or window origin')
      return
    }

    if (popupWindowOrigin === documentOrigin && (popup.location.search || popup.location.hash)) {
      let queryParams = popup.location.search.substring(1).replace(/\/$/, '')

      let qs = querystring.parse(queryParams)

      if (get(qs, 'error', null)) {
        clearInterval(intervalId)
        popup.close()
        return reject(new Error('Failed to login.'))
        // done(new Error(get(qs, 'error', null)))
      } else {
        clearInterval(intervalId)
        popup.close()
        return resolve(qs)
        // done(null, qs)
      }
    }
  }, 35)

  return intervalId
}

/**
 * Configure the popup
 */

function configure (options) {
  let width = options.width || 500
  let height = options.height || 735
  return assign({
    width: width,
    height: height,
    left: window.screenX + ((window.outerWidth - width) / 2),
    top: window.screenY + ((window.outerHeight - height) / 2.5)
  }, options || {})
}

/**
 * Stringify
 */

function stringify (obj) {
  let parts = []
  for (let key in obj) {
    parts.push(key + '=' + obj[key])
  }
  return parts.join(',')
}

export default open
