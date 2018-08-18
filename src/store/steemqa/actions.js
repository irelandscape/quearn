import axios from 'axios'

export const topics = (state) => {
  return axios.get(
    state.getters.serverURL + '/topic/'
  ).then(function (response) {
    state.commit('topics', response.data)
  }).catch(function (error) {
    console.log(error)
  })
}

export const favouriteTopics = (state, payload) => {
  return axios.get(
    state.getters.serverURL + '/favourite_topic/',
    {
      params: {
        username: payload.username,
        access_token: payload.accessToken
      }
    }
  ).then(function (response) {
    state.commit('favouriteTopics', response.data)
  }).catch(function (error) {
    console.log(error)
  })
}
