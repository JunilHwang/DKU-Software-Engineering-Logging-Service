import Vue from 'vue'
import jsYaml from 'js-yaml'
import { GithubContent } from 'domain/src'
import { Base64 } from 'js-base64'


export * from './response'

// 이벤트 버스
export const eventBus: Vue = new Vue()

// markdown content 에서 front matter를 파싱하여 반환
export const getFrontMatter = (content: string) => {
  const patterns = content.trim().match(/^-{3}((.|\n)*?)-{3}/)
  if (patterns === null) return null

  return jsYaml.safeLoad(patterns[1])
}

// markdown content 에서 frontmatter를 없앰
export const getContentWithoutFrontmatter = (content: string) => (
  content.trim()
    .replace(/^-{3}((.|\n)*?)-{3}((.|\n)*?)/gi, '$2').trim()
    .replace(/(```.*)(\{.*\})/g, '$1')
)

// markdown 렌더링 후 sidebar를 추가 한 다음
// 스크롤 이벤트를 감지하여 자동으로 active 상태 표기
export const sidebarAutoActive = (() => {
  let isLoaded = false
  return () => {
    if (isLoaded === true) return
    isLoaded = true
    window.addEventListener('scroll', e => {
      const markdownContent = document.querySelector<HTMLElement>('#markdown-content')
      const sidebar = document.querySelector<HTMLElement>('#markdown-sidebar')
      if (!sidebar) return

      const heading = markdownContent!.querySelectorAll<HTMLElement>('h2, h3')

      sidebar!.querySelectorAll('a').forEach((v: HTMLElement) => {
        const idx: number = parseInt(`${v.dataset!.idx}`)
        if (idx === undefined) return

        const wt = window.scrollY
        const from = heading[idx].offsetTop
        const to = heading[idx + 1] ? heading[idx + 1].offsetTop : wt + window.innerHeight

        v.classList[from <= wt && wt <= to ? 'add' : 'remove']('active')
      })
    })
  }
})();


export const blobToContent = ({ content, download_url, html_url }: GithubContent) => {
  return Base64.decode(content)
    .replace(/!\[(.*)\]\(([.|/].*)\)/gim, `![$1](${download_url}/../$2)`)
    .replace(/\[(.*)\]\(([.|/].*)\)/gim, `[$1](${html_url}/../$2)`)
}