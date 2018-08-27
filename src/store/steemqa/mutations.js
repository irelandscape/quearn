/*
export const someMutation = (state) => {}
 */

export const config = (state, config) => {
  state.config = config
}

export const topics = (state, topics) => {
  state.topics = topics
}

export const favouriteTopicsById = (state, topics) => {
  state.favouriteTopicsById = new Map()
  for (let topic of topics) {
    state.favouriteTopicsById.set(topic.id, topic)
  }
}

export const addFavouriteTopic = (state, topic) => {
  state.favouriteTopicsById.set(topic.id, topic)
}

export const removeFavouriteTopic = (state, id) => {
  state.favouriteTopicsById.delete(id)
}

export const serverURL = (state, serverURL) => {
  state.serverURL = serverURL
}
