import open from './popup'
import { get } from 'lodash-es'
import moment from 'moment/moment'

/*
export const someAction = (state) => {}
 */

export const parseSteemConnectCallback = (callbackData) => {
  const token = get(callbackData, 'access_token', null)
  const username = get(callbackData, 'username', null)
  const ttl = get(callbackData, 'expires_in', null)

  if (!token || !username || !ttl) {
    throw new Error('Invalid SteemConnect data.')
  }

  // determine the actual token expiration.
  const expiration = moment.utc().add(ttl, 'seconds').toISOString()

  // return a normalized SteemConnect data object.
  return { name: 'steem', access_token: token, meta: { username, ttl }, expiration }
}

export const login = (state) => {
  let link = state.getters.client.getLoginURL()

  // Return Promise
  return open(link, { width: 450, height: 745 })
    .then((result) => {
      state.commit('account', parseSteemConnectCallback(result))
    })
    .catch((error) => {
      console.log(error)
    })
}
