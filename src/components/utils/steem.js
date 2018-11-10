export function permlink (str) {
  return str.replace(/[^a-z0-9]+/gi, '-')
    . replace(/^-*|-*$/g, '')
    .toLowerCase()
}

export function editPost (client, username, config, permlink, title, tags, body, app) {
  tags.unshift(config.tag)
  return client.comment(
    '',
    tags[0],
    username,
    permlink,
    title,
    body,
    {
      tags: tags,
      app: app
    }
  )
}

export function editComment (client, parentAuthor, parentPermlink, config, username, permlink, body) {
  return client.comment(
    parentAuthor,
    parentPermlink,
    username,
    permlink,
    '',
    body,
    {}
  )
}

export function payout (blog) {
  let value = parseFloat(blog.total_payout_value) + parseFloat(blog.pending_payout_value)
  return value.toFixed(2)
}
