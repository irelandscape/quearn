// imports.
import client from '@steemit/steem-js'

// main application bootstrap (before router init methods).
export default (resources) => {
  client.config.uri = process.env.STEEM_API || 'https://api.steemit.com'
}
