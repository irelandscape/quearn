export default {
  client: null,
  dsteem: null,
  config: null,
  username: localStorage.getItem('username') || null,
  access_token: localStorage.getItem('access_token') || null,
  expires: localStorage.getItem('expires') || null,
  json_metadata: localStorage.getItem('json_metadata') || null,
  votingWeight: localStorage.getItem('votingWeight') || 100,
  accounts: {}
}
