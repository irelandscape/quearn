export function md2html (str, xss, removePatterns) {
  if (!str) {
    return
  }

  let Remarkable = require('remarkable')
  let md = new Remarkable('full', {
    html: true,
    linkify: false
  })

  for (let pattern of removePatterns) {
    str = str.replace(pattern, '')
  }

  str = xss.process(md.render(str))
  str = str.replace(/[^/"](https?:\/\/.*\.(?:png|jpe?g|gif))/g, '<img src="$1"/>')
  return str.replace(/(https?:\/\/.*\.(?:png|jpe?g|gif))/g, 'https://steemitimages.com/0x0/$1')
}
