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

export const addTopic = (state, payload) => {
  return axios.post(
    state.getters.serverURL + '/favourite_topic/',
    {
      username: payload.username,
      access_token: payload.accessToken,
      topic: payload.id
    }
  ).then(function (response) {
    state.commit('addFavouriteTopic', response.data.id)
  }).catch(function (error) {
    console.log(error)
  })
}

export const removeTopic = (state, payload) => {
  return axios.delete(
    state.getters.serverURL + '/favourite_topic/',
    {
      params: {
        username: payload.username,
        access_token: payload.accessToken,
        topic: payload.id
      }
    }
  ).then(function (response) {
    state.commit('removeFavouriteTopic', payload.id)
  }).catch(function (error) {
    console.log(error)
  })
}
