<template>
  <div>
    <github-repository-list @show-repository="showRepository" />
    <github-repository @show-content="showContent" ref="repository" />
    <github-content ref="content" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { GithubRepositoryList, GithubRepository } from '@/components';
import { GithubRepository as GithubRepositoryType } from '@Domain/github'

const components = { GithubRepositoryList, GithubRepository }

@Component({ components })
export default class Factory extends Vue {
  showRepository (repository: GithubRepositoryType) {
    const target: any = this.$refs.repository
    target.open(repository)
  }

  showContent (args: any) {
    const target: any = this.$refs.content
    target.open(...args)
  }
}
</script>