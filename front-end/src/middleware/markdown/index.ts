import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/atom-one-dark.css'

const md = new MarkdownIt();


md.use(require('markdown-it-highlightjs'))
md.use(require('markdown-it-front-matter'), console.log)
md.use(require('markdown-it-plantuml'))

export default md