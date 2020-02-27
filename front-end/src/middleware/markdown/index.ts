import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

// md.use(require('markdown-it-prism'))
md.use(require('markdown-it-front-matter'), console.log)
md.use(require('markdown-it-plantuml'))

export default md