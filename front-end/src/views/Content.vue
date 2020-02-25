<template>
  <main id="content" v-html="content"></main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { md } from '@/middleware'
import { githubService } from '@/services'
import { GithubContent } from '../../../back-end/src/domain/Github';

@Component
export default class Content extends Vue {
  content: string|null = null
  async created () {
    const result = await githubService.getContent({user: 'junilhwang', repo: 'TIL', path: 'README.md'}) as GithubContent
    this.content = md.render(result.content!)
  }
}
</script>