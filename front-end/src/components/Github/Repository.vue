<template>
  <section class="repository">
    <h2>Repository</h2>
    <ul>
      <li v-for="(repository, k) in repositories" :key="k">
        <el-link type="primary" @click.native="showContents(repository)">{{ repository.name }}</el-link>
      </li>
    </ul>
    <el-dialog :title="dialogTitle" :visible.sync="opened">
      test
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
  private repoRoute = []

  created () {
    this.fetchRepo()
  }

  showContents (repository: GithubRepository) {
    const user: string = this.profile.login
    const repo: string = repository.name
    this.opened = true
    this.selected = repository

    githubService
      .getContent({ repo, user, path: '' })
      .then(data => {
        console.log(data)
      })
  }
}
</script>
