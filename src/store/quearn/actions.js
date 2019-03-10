import axios from 'axios'
import { Loading, Notify } from 'quasar'

export const favouriteTopicsById = (state, payload) => {
  return axios.get(
    state.getters.serverURL + '/favourite_topics/',
    {
      params: {
        username: payload.username,
        posting_key: payload.pk
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
      posting_key: payload.pk,
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
            posting_key: payload.pk
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

export const addBookmark = (state, params) => {
  Loading.show({
    message: params.vue.$tc('addingbookmark')
  })

  axios.post(
    state.getters.serverURL + '/bookmarks/',
    {
      question: params.question.id,
      username: params.username,
      posting_key: params.pk
    }
  ).then((response) => {
    state.commit('addBookmark', response.data)
    Loading.hide()
    Notify.create({
      message: params.vue.$tc('success'),
      type: 'positive'
    })
  }).catch((err) => {
    Notify.create({
      message: params.vue.$tc('error'),
      detail: err.error_description,
      type: 'negative'
    })
    Loading.hide()
  })
}

export const removeBookmark = (state, params) => {
  Loading.show({
    message: params.vue.$tc('removingbookmark')
  })

  axios.delete(
    state.getters.serverURL + '/bookmarks/' + params.bookmark.id + '/',
    {
      params: {
        username: params.username,
        posting_key: params.pk
      }
    }
  ).then((response) => {
    state.commit('removeBookmark', params.bookmark)
    Loading.hide()
    Notify.create({
      message: params.vue.$tc('success'),
      type: 'positive'
    })
  }).catch((err) => {
    Notify.create({
      message: params.vue.$tc('error'),
      detail: err.error_description,
      type: 'negative'
    })
    Loading.hide()
  })
}
