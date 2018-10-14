/*
export const someGetter = (state) => {}
 */

export const client = (state) => {
  return state.client
}

export const dsteem = (state) => {
  return state.dsteem
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

export const reputation = (state) => (username) => {
  if (username in state.accounts) {
    let rep = Math.log10(state.accounts[username].reputation)
    rep = rep - 9
    if (rep < 0) {
      rep = 0
    }
    if (state.accounts[username].reputation < 0) {
      rep *= -1
    }

    rep = (rep * 9) + 25

    return Math.floor(rep)
  } else {
    return ''
  }
}
