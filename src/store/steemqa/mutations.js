/*
export const someMutation = (state) => {}
 */

export const appName = (state, name) => {
  state.appName = name
}

export const topics = (state, topics) => {
  state.topics = topics
}

export const favouriteTopics = (state, topics) => {
  state.favouriteTopics = {}
  for (let topic of topics) {
    state.favouriteTopics[topic.topic] = topic
  }
}

export const addFavouriteTopic = (state, topic) => {
  state.favouriteTopics[topic.topic] = topic
}

export const removeFavouriteTopic = (state, id) => {
  delete state.favouriteTopics[id]
}

export const serverURL = (state, serverURL) => {
  state.serverURL = serverURL
}
