<template>
  <main id="content" v-html="content"></main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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
    const markdown = "```js{1}\n" +
                     "class Demo { };\n"+
                     "```";
    this.content = md.render(markdown)
  }
}
</script>