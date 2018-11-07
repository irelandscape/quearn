export function md2html (str, xss, addonMsg) {
  let Remarkable = require('remarkable')
  let md = new Remarkable('full', {
    html: true,
    linkify: false
  })
  if (addonMsg && addonMsg.length) {
    str = str.replace(addonMsg, '')
  }

  str = xss.process(md.render(str))
  return str.replace(/[^"](https?:\/\/.*\.(?:png|jpe?g|gif))/g, '<img src="$1"/>')
}
