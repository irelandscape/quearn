/*
export const someMutation = (state) => {}
 */

export const dsteem = (state, client) => {
  state.dsteem = client
}

export const votingWeight = (state, weight) => {
  state.votingWeight = weight
  localStorage.setItem('votingWeight', weight)
}

export const userAccount = (state, info) => {
  state.accounts[info.name] = info
  state.accounts = {...state.accounts}
}

export const pendingAccount = (state, pk) => {
  state.accounts[pk] = { reputation: '...' }
}

export const logout = (state) => {
  state.pk = null
  state.authDetails = null
  localStorage.removeItem('pk')
  localStorage.removeItem('authDetails')
}

export const username = (state, username) => {
  state.username = username
  localStorage.setItem('username', username)
}

export const authDetails = (state, authDetails) => {
  state.authDetails = authDetails
  localStorage.setItem('authDetails', authDetails)
}
