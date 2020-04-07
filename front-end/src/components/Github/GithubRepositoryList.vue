<template>
  <el-dialog :visible.sync="opened" width="500px">
    <h3 slot="title">
      <i class="el-icon-coin" />
      Repository List
    </h3>
    <ul v-if="opened">
      <li v-for="(repository, k) in repositories" :key="k">
        <a href="#" type="primary" @click.prevent="$emit('select', repository)">
          <i class="el-icon-unlock" />
          {{ repository.name }}
        </a>
      </li>
    </ul>
  </el-dialog>
</template>

<script lang="ts">
import {Vue, Component, Emit} from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { Action, State } from 'vuex-class'
import { GithubProfile, GithubRepository } from '@Domain'
import { FETCH_GITHUB_REPO } from '@/middleware/store/types/MutationType'

@Component
export default class RepositoryList extends Vue {

  @State(state => state.github.repositories) repositories!: GithubRepository[]
  @State(state => state.user.profile) profile!: GithubProfile
  @Action(FETCH_GITHUB_REPO) fetchRepo!: ActionMethod

  private opened = false

  async open () {
    this.opened = true
    try {
      this.fetchRepo(this.profile)
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 Repository를 가져올 수 없습니다.' })
    }
  }

  close () {
    this.opened = false
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/lib";

h3 {
  margin: 0;
  padding: 0;
  font-weight: 100;
  font-family: enFont();
  font-size: 25px;
  line-height: 1;
}

ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  line-height: 160%;
  font-size: 17px;
  font-family: enFont();
}
a {
  display: inline-block;
  position: relative;
  transition: color 0.3s;

  &:after {
    content: "";
    display: block;
    height: 1px;
    width: 0;
    position: absolute;
    bottom: 0;
    background: #06F;
    transition: width 0.3s;
  }

  &:hover {
    color: #06F;

    &:after {
      width: 100%;
    }
  }
}
</style>
