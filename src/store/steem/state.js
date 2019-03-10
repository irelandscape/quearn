export default {
  dsteem: null,
  config: null,
  username: localStorage.getItem('username') || null,
  authDetails: localStorage.getItem('authDetails') || null,
  pk: null,
  votingWeight: localStorage.getItem('votingWeight') || 100,
  accounts: {}
}
