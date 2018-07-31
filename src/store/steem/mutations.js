import sdk from 'sc2-sdk'
/*
export const someMutation = (state) => {}
 */

export const createClient = (state, info) => {
  state.client = sdk.Initialize(info)
}

export const account = (state, info) => {
  state.client.setAccessToken(info.secret)
  state.username = info.meta.username
  localStorage.setItem('username', info.meta.username)
  state.secret = info.secret
  localStorage.setItem('secret', info.secret)
  state.expires = info.expiration
  localStorage.setItem('expires', info.expiration)
}

export const logout = (state) => {
  state.account = null
  state.username = undefined
  localStorage.removeItem('username')
  state.secret = undefined
  localStorage.removeItem('secret')
  state.expires = undefined
  localStorage.removeItem('expires')
  state.json_metadata = undefined
  localStorage.removeItem('json_metadata')
}

export const metadata = (state, info) => {
  state.json_metadata = info
  localStorage.setItem('json_metadata', info)
}
