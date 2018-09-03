// imports.
import { Client } from 'dsteem'

// main application bootstrap (before router init methods).
export default ({ store }) => {
  let dsteem = new Client('https://api.steemit.com')
  store.commit('steem/dsteem', dsteem)
}
