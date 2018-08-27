/*
export const someGetter = (state) => {}
 */

export const client = (state) => {
  return state.client
}

export const loggedIn = (state) => {
  return state.access_token != null
}

export const avatar = (state) => {
  return 'https://steemitimages.com/u/' + state.username + '/avatar'
}

export const username = (state) => {
  return state.username
}

export const accessToken = (state) => {
  return state.access_token
}

export const votingWeight = (state) => {
  return state.votingWeight
}
