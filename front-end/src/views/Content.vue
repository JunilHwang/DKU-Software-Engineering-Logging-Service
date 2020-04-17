<template>
  <div class="container">
    <markdown v-if="content !== null" :content="content" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Base64 } from 'js-base64'
import { githubService } from '@/services'
import { GithubContent } from 'domain/src';
import { Markdown } from '@/components/Markdown';

const components = { Markdown }

@Component({ components })
export default class Content extends Vue {
  content: string|null = null

  async loadGitContent () {
    const user = 'junilhwang'
    const repo = 'TIL'
    const path = 'CodeSpitz/Object-Oriented-Javascript/01-Intro/README.md'
    const result = await githubService.getContent({ user, repo, path }) as GithubContent
    const decodedContent = Base64.decode(result.content!)
    this.content = decodedContent
  }

  created () {
    this.loadGitContent()
  }
}
</script>