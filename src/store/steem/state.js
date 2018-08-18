export default {
  client: null,
  username: localStorage.getItem('username') || null,
  access_token: localStorage.getItem('access_token') || null,
  expires: localStorage.getItem('expires') || null,
  json_metadata: localStorage.getItem('json_metadata') || null
}
