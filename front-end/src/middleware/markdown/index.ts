import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/atom-one-dark.css'
import { safeLoad } from 'js-yaml'

export const frontMatter = {
  _value: {},
  get: () => frontMatter._value,
  set: (val: string) => {
    frontMatter._value = safeLoad(val)
  }
}

const md = new MarkdownIt();
md.use(require('markdown-it-highlightjs'))
md.use(require('markdown-it-front-matter'), frontMatter.set)
md.use(require('markdown-it-plantuml'))
md.use(require('markdown-it-underline'))
md.use(require('markdown-it-container'), 'tip', {

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