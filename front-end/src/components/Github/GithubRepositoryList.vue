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
    <div class="btnGroup center">
      <el-tooltip content="캐시된 데이터를 강제로 제거합니다.">
        <el-button @click="refresh" type="default" icon="el-icon-refresh" size="mini" plain>
          새로고침
        </el-button>
      </el-tooltip>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {Vue, Component, Emit} from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { namespace } from 'vuex-class'
import { GithubProfile, GithubRepository } from 'domain/src'

const githubStore = namespace('github')
const userStore = namespace('user')

@Component
export default class RepositoryList extends Vue {

  @githubStore.State private repositories!: GithubRepository[]
  @userStore.State private profile!: GithubProfile
  @githubStore.Action private FETCH_GITHUB_REPO!: ActionMethod

  private opened = false

  public async open () {
    this.opened = true
    this.FETCH_GITHUB_REPO(this.profile)
  }

  public close () {
    this.opened = false
  }

  private refresh () {
    this.repositories.forEach(({ full_name }) => localStorage.removeItem(full_name + '/sha'))
    this.$message({ type: 'success', message: '캐시를 제거하였습니다.' })
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/lib";

h3 {
  margin: 0 0 -20px;
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
