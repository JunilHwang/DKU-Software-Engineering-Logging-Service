import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/atom-one-dark.css'

const md = new MarkdownIt();
const container = require('markdown-it-container')
const frontMatterParser = require('parser-front-matter')

export const frontMatter = {
  _value: null,
  get: () => frontMatter._value,
  set: (val: string) => {
    frontMatterParser.parse(val, (err: any, res: any) => {
      frontMatter._value = res
    })
  }
}


md.use(require('markdown-it-highlightjs'))
md.use(require('markdown-it-front-matter'), frontMatter.set)
md.use(require('markdown-it-plantuml'))
md.use(require('markdown-it-underline'))
md.use(container, 'tip', {

  validate: function(params: string) {
    return params.trim().match(/^tip\s*(.*)$/);
  },

  render: function (tokens: any, idx: number) {
    const m = tokens[idx].info.trim().match(/^tip\s*(.*)$/);

    return `${tokens[idx].nesting === 1
      ? `<div class="markdownContainer tip">
           <strong class="markdownContainerTitle">${md.utils.escapeHtml(m[1] || 'tip')}</strong>`
      : `</div>`
    }`
  }
});

export default md