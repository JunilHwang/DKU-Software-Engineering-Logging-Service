<template>
  <div>
    <github-repository-list @show-repository="showRepository" />
    <github-repository @show-content="showContent" ref="repository" />
    <github-content @save-editing="showSaveEditor" ref="content" />
    <github-content-save-editor ref="saveEditor" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { GithubRepositoryList, GithubRepository, GithubContent, GithubContentSaveEditor } from './index';
import { GithubRepository as GithubRepositoryType, PostVO } from '@Domain'

const components = { GithubRepositoryList, GithubRepository, GithubContent, GithubContentSaveEditor }

@Component({ components })
export default class GithubFactory extends Vue {
  showRepository (repository: GithubRepositoryType) {
    const target: any = this.$refs.repository
    target.open(repository)
  }

  showContent (args: any) {
    const target: any = this.$refs.content
    target.open(...args)
  }

  showSaveEditor (postVO: PostVO) {
    const target: any = this.$refs.saveEditor
    target.open(postVO)
  }
}
</script>