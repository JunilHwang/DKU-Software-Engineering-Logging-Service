<template>
  <main id="content" v-html="content"></main>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { md } from '@/middleware'
import { githubService } from '@/services';

@Component
export default class Content extends Vue {
  content = null
  baseURL = 'https://github.com'
  async created () {
    const content = await githubService.getContent({user: 'junilhwang', repo: 'TIL', path: 'README.md'})
    this.content = md.render(content)
  }
}
</script>