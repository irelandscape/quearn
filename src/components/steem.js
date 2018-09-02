export function permlink (str) {
  return str.replace(/[^a-z0-9]+/gi, '-')
    . replace(/^-*|-*$/g, '')
    .toLowerCase()
}

export function editPost (client, username, config, permlink, title, tags, body) {
  tags.unshift(config.tag)
  return client.comment(
    '',
    tags[0],
    username,
    permlink,
    title,
    body,
    {
      tags: tags
    }
  )
}
