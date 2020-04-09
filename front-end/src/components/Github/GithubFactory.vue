<template>
  <div>
    <github-repository-list ref="repositories" @select="showRepository" />
    <github-repository @show-content="showContent" ref="repository" />
    <github-content @save-editing="showSaveEditor" ref="content" />
    <github-content-save-editor ref="saveEditor" @all-close="allClose" />
    <github-link-editor @show-content="showContent" ref="linkEditor" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { components } from './index';
import { GithubRepository, PostVO } from '@Domain'
import { eventBus } from '@/helper'

interface DialogComponent extends Vue {
  open: Function
  close: Function
}

@Component({ components })
export default class GithubFactory extends Vue {

  private state: 'add'|'update' = 'add'

  private showRepository (repository: GithubRepository) {
    const target = this.$refs.repository as DialogComponent
    target.open(repository)
  }

  private showContent (args: any) {
    if (args === null) return
    const target = this.$refs.content as DialogComponent
    target.open(...args)
  }

  private showSaveEditor (postVO: PostVO) {
    const target = this.$refs.saveEditor as DialogComponent
    target.open(postVO)
  }

  private allClose () {
    Object.values(this.$refs).forEach((v: any) => v.close())
  }

  private created () {
    eventBus.$on('repositoryListOpen', () => {
      const target = this.$refs.repositories as DialogComponent
      target.open()
    })
  }
}
</script>