export default {
  client: null,
  username: localStorage.getItem('username') || null,
  secret: localStorage.getItem('secret') || null,
  expires: localStorage.getItem('expires') || null,
  json_metadata: localStorage.getItem('json_metadata') || null
}
