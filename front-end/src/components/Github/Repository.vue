<template>
  <section class="repository">
    <h2>Repository</h2>
    <ul>
      <li v-for="({ name }, k) in repo" :key="k">
        <el-link type="primary" @click.native="showContents(name)">{{ name }}</el-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Action, State } from 'vuex-class'
import { FETCH_REPO } from '@/middleware/store/MutationType';
import { ProfileType, RepositoryType } from '@/middleware/store/StateType';
import { ActionMethod } from 'vuex';
import { githubService } from '@/services';

@Component
export default class Repository extends Vue {
  @Action(FETCH_REPO) fetchRepo!: ActionMethod
  @State(state => state.github.repository) repo!: RepositoryType
  @State(state => state.user.profile) profile!: ProfileType

  created () {
    this.fetchRepo()
  }

  showContents (repo: string) {
    const user: string = this.profile.login
    githubService
      .getContent({ repo, user, path: '' })
      .then(console.log)
  }
}
</script>
