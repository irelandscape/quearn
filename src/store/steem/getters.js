/*
export const someGetter = (state) => {}
 */

export const client = (state) => {
  return state.client
}

export const loggedIn = (state) => {
  return state.secret != null
}

export const avatar = (state) => {
  return 'https://steemitimages.com/u/' + state.username + '/avatar'
}

export const username = (state) => {
  return state.username
}
