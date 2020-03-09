import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/atom-one-dark.css'

const md = new MarkdownIt();
md.use(require('markdown-it-highlightjs'))
md.use(require('markdown-it-plantuml'))
md.use(require('markdown-it-underline'))
md.use(require('markdown-it-anchor').default, {
  permalinkClass: 'header-anchor',
  permalink: true,
  permalinkBefore: true,
  permalinkSymbol: '#'
})
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