<template>
  <el-dialog :visible.sync="opened" class="repositoryContent" width="600px">
    <h3 class="repositoryContentHeader" slot="title" v-html="dialogTitle" />
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="({ sha, path }, k) in route" :key="k">
        <a href="#" @click.prevent="goToPath(sha, k)" v-html="path" />
      </el-breadcrumb-item>
    </el-breadcrumb>
    <ul class="repositoryContentItem" v-if="trees !== null">
      <li v-for="(tree, k) in trees" :key="k">
        <el-link @click.native="showContent(tree)">
          <i :class="`el-icon-${tree.type === 'blob' ? 'document' : 'folder'}`"></i>
          {{ tree.path }}
        </el-link>
      </li>
    </ul>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { State } from 'vuex-class'
import { GithubRepository, GithubTrees, GithubTree, GithubBlob } from '@Domain/Github'
import { githubService } from '@/services'
import { Markdown } from '@/components'
import {ContentVO} from "@/services/GithubService";

const components = { Markdown }

interface RepoRoute {
  path: string
  sha: string|null
}

@Component({ components })
export default class Repository extends Vue {

  //========== mapper ==========//
  @State(state => state.user.profile.login) user!: string
  @State(state => state.user.access_token) access_token!: string

  //========== data ==========//
  private opened = false
  private repository: GithubRepository|null = null
  private route: RepoRoute[] = []
  private trees: GithubTree[]|null = null

  //========== computed ==========//
  private get dialogTitle (): string {
    return this.repository !== null ? this.repository.name : ''
  }

  //========== methods ==========//

  showDirectory (params: ContentVO) {
    return githubService
      .getTrees(params)
      .then(({ tree }: GithubTrees) => {
        tree.sort((a: GithubTree, b: GithubTree) => {
          if (a.type !== b.type) {
            return a.type === 'blob' ? 1 : -1
          } else {
            return a.path < b.path ? -1 : 1
          }
        })
        this.trees = tree
        console.log(tree)
      })
  }

  async open (repository: GithubRepository) {
    this.opened = true
    this.repository = repository

    const repo: string = this.repository.name
    const user: string = this.user

    const sha: string = await githubService.getCommitSha({ repo, user })
    this.route = [
      { path: user, sha: null },
      { path: repo, sha }
    ]
    this.showDirectory({ repo, user, sha })
  }

  async showContent (tree: GithubTree) {
    const { type, path, sha } = tree
    const repo: string = this.repository!.name
    const user: string = this.user
    const params = { user, repo, sha }

    if (type === 'tree') {
      this.route.push({ path, sha })
      this.showDirectory(params)
      return
    }

    const ext = path.replace(/.*\.(.*)/, '$1')
    if (ext !== 'md') {
      this.$message({ type: 'warning', message: `Markdown File만 조회할 수 있습니다` })
      return
    }
    const data: GithubBlob = await githubService.getBlob(params)
    const route = this.route.map(({ path }) => path)
    route.push(path)
    this.$emit('show-content', [data, route])
  }

  goToPath (sha: string|null, key: number) {
    if (sha === null) {
      this.opened = false
      return
    }

    const repo: string = this.repository!.name
    const user: string = this.user
    const route: RepoRoute[] = [ ...this.route ]

    this
      .showDirectory({ user, repo, sha })
      .then(() => {
        this.route = route.filter((v, k) => k <= key)
      })
  }
}
</script>