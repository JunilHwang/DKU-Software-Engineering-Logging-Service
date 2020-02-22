<template>
  <main id="content" v-html="content"></main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { md } from '@/middleware'
import { githubService } from '@/services';

@Component
export default class Content extends Vue {
  content: string|null = null
  async created () {
    const content = await githubService.getContent({user: 'junilhwang', repo: 'TIL', path: 'README.md'})
    this.content = md.render(content)
  }
}
</script>