<template>
  <section class="repository">
    <h2>Repository</h2>
    <ul>
      <li v-for="(repository, k) in repositories" :key="k">
        <el-link type="primary" @click.native="showContents(repository)" v-html="repository.name" />
      </li>
    </ul>
    <el-dialog :visible.sync="opened" class="repositoryContent">
      <h3 class="repositoryContentHeader" slot="title" v-html="dialogTitle" />
      <el-breadcrumb separator="&gt;">
        <el-breadcrumb-item v-for="(v, k) in repoRoute" :key="k" v-html="v" />
      </el-breadcrumb>
      <ul class="repositoryContentItem">
        <li v-for="(content, k) in contents">
          <el-link @click.native="viewContents(content)">
            <i :class="`el-icon-${content.type === 'file' ? 'document' : 'folder'}`"></i>
            {{ content.name }}
          </el-link>
        </li>
      </ul>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Action, State } from 'vuex-class'
import { FETCH_REPO } from '@/middleware/store/MutationType';
import { GithubProfile, GithubRepository, GithubContent } from '@Domain/Github';
import { ActionMethod } from 'vuex';
import { githubService } from '@/services';

@Component
export default class Repository extends Vue {
  @Action(FETCH_REPO) fetchRepo!: ActionMethod
  @State(state => state.github.repositories) repositories!: Array<GithubRepository>
  @State(state => state.user.profile) profile!: GithubProfile

  private opened = false
  private selected: GithubRepository|null = null
  private get dialogTitle (): string {
    return this.selected !== null ? this.selected.name : ''
  }
  private repoRoute: string[] = []
  private contents: GithubContent[] = []
  private repo: string = ''

  created () {
    this.fetchRepo()
  }

  showContents (repository: GithubRepository) {
    const user: string = this.profile.login
    const repo: string = this.repo = repository.name
    this.opened = true
    this.selected = repository

    this.repoRoute = ['Root']
    this.contents = []

    githubService
      .getContent({ repo, user, path: '' })
      .then(data => {
        this.contents = data as GithubContent[]
        this.contents.sort((a: GithubContent, b: GithubContent) => {
          if (a.type !== b.type) {
            return a.type === 'file' ? 1 : -1
          } else {
            return a.name < b.name ? -1 : 1
          }
        })
      })
  }

  viewContents ({ type, path }: GithubContent) {
    const user: string = this.profile.login
    const { repo } = this
    if (type === 'dir') {
      this.repoRoute.push(path)
    }

    githubService
      .getContent({ repo, user, path })
      .then(console.log)
  }
}
</script>
