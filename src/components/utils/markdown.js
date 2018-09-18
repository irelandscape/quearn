export function md2html (str, xss) {
  let Remarkable = require('remarkable')
  let md = new Remarkable('full', {
    html: true,
    linkify: true
  })
  return xss.process(md.render(str))
}
