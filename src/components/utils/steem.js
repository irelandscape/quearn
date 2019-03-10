import { get, set } from 'idb-keyval'
import { PrivateKey } from 'dsteem'

export function permlink (str) {
  return str.replace(/[^a-z0-9]+/gi, '-')
    . replace(/^-*|-*$/g, '')
    .toLowerCase()
}

export function editPost (dsteem, pk, username, config, permlink, title, tags, body, app) {
  tags.unshift(config.tag)
  return dsteem.broadcast.comment(
    {
      parent_author: '',
      parent_permlink: tags[0],
      author: username,
      permlink: permlink,
      title: title,
      body: body,
      json_metadata: JSON.stringify({
        tags: tags,
        app: app
      })
    },
    PrivateKey.fromString(pk)
  )
}

export function editComment (dsteem, pk, parentAuthor, parentPermlink, config, username, permlink, body) {
  return dsteem.broadcast.comment(
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author: username,
      permlink: permlink,
      title: '',
      body: body,
      json_metadata: JSON.stringify({})
    },
    PrivateKey.fromString(pk)
  )
}

export function payout (blog) {
  let value = parseFloat(blog.total_payout_value) + parseFloat(blog.pending_payout_value)
  return value.toFixed(2)
}

function stringToUint8Array (str) {
  let uint = new Uint8Array(str.length)
  for (let i = 0, j = str.length; i < j; ++i) {
    uint[i] = str.charCodeAt(i)
  }

  return uint
}

function arrayBufferToBase64 (arrayBuffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
}

function base64ToArrayBuffer (str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

function arrayBufferToString (sourcebuffer) {
  let str = ''
  let buf = new Uint8Array(sourcebuffer)
  for (var i = 0; i < buf.byteLength; i++) {
    str += String.fromCharCode(buf[i])
  }

  return str
}

export function storeAuthDetails (auth) {
  let key
  let iv

  return window.crypto.subtle.generateKey(
    {
      name: 'AES-CBC',
      length: 256
    },
    false, // Not extractable
    ['encrypt', 'decrypt']).then((k) => {
    key = k
    return set('authKey', key)
  }).then(() => {
    iv = window.crypto.getRandomValues(new Uint8Array(16))
    return set('authIv', iv)
  }).then(() => {
    return window.crypto.subtle.encrypt({
      name: 'AES-CBC',
      iv
    },
    key,
    stringToUint8Array(auth)
    )
  }).then((encrypted) => {
    return arrayBufferToBase64(encrypted)
  }).catch((error) => {
    console.log(error)
  })
}

export function decryptAuthDetails (encrypted) {
  let key

  return get('authKey').then((k) => {
    key = k
    return get('authIv')
  }).then((iv) => {
    return window.crypto.subtle.decrypt({
      name: 'AES-CBC',
      iv
    },
    key,
    base64ToArrayBuffer(encrypted))
  }).then((result) => {
    return JSON.parse(arrayBufferToString(result))
  })
}
