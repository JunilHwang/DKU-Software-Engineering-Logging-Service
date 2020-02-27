<template>
  <main id="content" v-html="content"></main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Base64 } from 'js-base64'
import { md } from '@/middleware'
import { githubService } from '@/services'
import { GithubContent } from '@Domain/Github';

@Component
export default class Content extends Vue {
  content: string|null = null

  async loadGitContent () {
    const user = 'junilhwang'
    const repo = 'TIL'
    const path = 'CodeSpitz/Object-Oriented-Javascript/01-Intro/README.md'
    const result = await githubService.getContent({ user, repo, path }) as GithubContent
    this.content = md.render(Base64.decode(result.content!))
  }

  created () {
    this.loadGitContent()
  }
}
</script>