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
  state.favouriteTopics = topics
}

export const serverURL = (state, serverURL) => {
  state.serverURL = serverURL
}
