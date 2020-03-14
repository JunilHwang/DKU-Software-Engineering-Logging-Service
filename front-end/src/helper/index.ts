import Vue from 'vue'
import jsYaml from 'js-yaml'

export const eventBus: Vue = new Vue()

export const getFrontMatter = (content: string) => {
  const patterns = content.trim().match(/^-{3}((.|\n)*?)-{3}/)
  if (patterns === null) return null

  return jsYaml.safeLoad(patterns[1])
}

export const getContentWithoutFrontmatter = (content: string) => (
  content.trim()
    .replace(/^-{3}((.|\n)*?)-{3}((.|\n)*?)/gi, '$2').trim()
    .replace(/(```.*)(\{.*\})/g, '$1')
)

const sidebarAutoActiveWrapper = () => {
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
}

export const sidebarAutoActive = sidebarAutoActiveWrapper()