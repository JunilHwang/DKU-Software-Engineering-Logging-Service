<template>
  <el-dialog title="Repository List" :visible.sync="opened" width="500px">
    <ul>
      <li v-for="(repository, k) in repositories" :key="k">
        <el-link type="primary" @click.native="showContents(repository)" v-html="repository.name" />
      </li>
    </ul>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { Action, State } from 'vuex-class'
import { GithubRepository } from '@Domain/Github'
import { FETCH_GITHUB_REPO } from '@/middleware/store/types/MutationType'
import { eventBus } from '@/helper';

@Component
export default class RepositoryList extends Vue {

  @State(state => state.github.repositories) repositories!: Array<GithubRepository>
  @Action(FETCH_GITHUB_REPO) fetchRepo!: ActionMethod

  private opened = false

  showContents (repository: GithubRepository) {
    this.$emit('show-repository', repository)
  }

  open () {
    this.opened = true
    this.fetchRepo()
  }

  created () {
    eventBus.$on('repositoryListOpen', this.open)
  }
}
</script>
