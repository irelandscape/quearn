import axios from 'axios'

export const favouriteTopicsById = (state, payload) => {
  return axios.get(
    state.getters.serverURL + '/favourite_topics/',
    {
      params: {
        username: payload.username,
        access_token: payload.accessToken
      }
    }
  ).then(function (response) {
    state.commit('favouriteTopicsById', response.data)
  }).catch(function (error) {
    console.log(error)
  })
}

export const addTopic = (state, payload) => {
  return axios.post(
    state.getters.serverURL + '/favourite_topics/',
    {
      username: payload.username,
      access_token: payload.accessToken,
      topic: payload.id
    }
  ).then(function (response) {
    state.commit('addFavouriteTopic', response.data)
  }).catch(function (error) {
    console.log(error)
  })
}

export const removeTopic = (state, payload) => {
  for (let topic of state.getters.favouriteTopicsById) {
    if (topic[1].topic.toString() === payload.id) {
      return axios.delete(
        state.getters.serverURL + '/favourite_topics/' + topic[0] + '/',
        {
          params: {
            username: payload.username,
            access_token: payload.accessToken
          }
        }
      ).then(function (response) {
        state.commit('removeFavouriteTopic', topic[0])
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
