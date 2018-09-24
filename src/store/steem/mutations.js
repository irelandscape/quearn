/*
export const someMutation = (state) => {}
 */

export const createClient = (state, info) => {
  let sdk = require('sc2-sdk/lib/browser.js')
  state.client = sdk.Initialize(info)
}

export const dsteem = (state, client) => {
  state.dsteem = client
}

export const account = (state, info) => {
  state.client.setAccessToken(info.access_token)
  state.username = info.meta.username
  localStorage.setItem('username', info.meta.username)
  state.access_token = info.access_token
  localStorage.setItem('access_token', info.access_token)
  state.expires = info.expiration
  localStorage.setItem('expires', info.expiration)
}

export const logout = (state) => {
  state.account = null
  state.username = undefined
  localStorage.removeItem('username')
  state.access_token = undefined
  localStorage.removeItem('access_token')
  state.expires = undefined
  localStorage.removeItem('expires')
  state.json_metadata = undefined
  localStorage.removeItem('json_metadata')
}

export const metadata = (state, info) => {
  state.json_metadata = info
  localStorage.setItem('json_metadata', info)
}

export const votingWeight = (state, weight) => {
  state.votingWeight = weight
  localStorage.setItem('votingWeight', weight)
}
