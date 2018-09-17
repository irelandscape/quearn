// imports.
import { Client } from 'dsteem'

// main application bootstrap (before router init methods).
export default ({ store }) => {
  let dsteem = new Client('https://rpc.steemliberator.com')
  store.commit('steem/dsteem', dsteem)
}
