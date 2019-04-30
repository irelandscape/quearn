import { storeAuthDetails } from 'components/utils/steem'

export const account = (state, username) => {
  state.commit('pendingAccount', username)
  let dsteem = state.getters.dsteem
  dsteem.database.getAccounts([username])
    .then((result) => {
      state.commit('userAccount', result[0])
    }).catch((error) => {
      console.log(error)
    })
}

export const authDetails = (state, authDetails) => {
  let json = JSON.parse(authDetails)
  state.commit('username', json.steemUsername)

  return storeAuthDetails(authDetails).then((encrypted) => {
    state.commit('authDetails', encrypted)
  })
}

export const logout = (state) => {
  state.commit('logout')
}
