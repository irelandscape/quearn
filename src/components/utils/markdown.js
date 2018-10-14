export function md2html (str, xss, addonMsg) {
  let Remarkable = require('remarkable')
  let md = new Remarkable('full', {
    html: true,
    linkify: true
  })
  if (addonMsg && addonMsg.length) {
    str = str.replace(addonMsg, '')
  }

  return xss.process(md.render(str))
}
