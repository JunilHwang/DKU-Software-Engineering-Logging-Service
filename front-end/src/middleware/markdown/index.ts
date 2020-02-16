import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
  .use(
    require('markdown-it-front-matter'),
    (fm: any) => {
      console.log(fm)
    })

export default md