import Vue from 'vue'
import jsYaml from 'js-yaml'

export const eventBus: Vue = new Vue()

export const getFrontMatter = (content: string) => (
  jsYaml.safeLoad(content.trim().replace(/^-{3}((.|\n)*?)-{3}((.|\n)*)/gi, '$1').trim())
)

export const getContentWithoutFrontmatter = (content: string) => (
  content.trim()
    .replace(/^-{3}((.|\n)*?)-{3}((.|\n)*?)/gi, '$2').trim()
    .replace(/(```.*)(\{.*\})/g, '$1')
)