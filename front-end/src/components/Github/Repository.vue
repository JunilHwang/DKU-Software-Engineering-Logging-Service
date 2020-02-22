<template>
  <section class="repository">
    <h2>Repository</h2>
    <ul>
      <li v-for="({ name }, k) in repo" :key="k">
        <el-link>{{ name }}</el-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Action, State } from 'vuex-class'
import { FETCH_REPO } from '@/middleware/store/MutationType';
import { RepositoryType} from '@/middleware/store/StateType';
import { ActionMethod } from 'vuex';

@Component
export default class Repository extends Vue {
  @Action(FETCH_REPO) fetchRepo!: ActionMethod
  @State(state => state.github.repository) repo!: Array<RepositoryType>

  created () {
    this.fetchRepo()
  }

  contentLoad (repository: RepositoryType) {
    const { name } = repository
  }
}
</script>