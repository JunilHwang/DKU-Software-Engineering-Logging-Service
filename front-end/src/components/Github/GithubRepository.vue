<template>
  <el-dialog :visible.sync="opened" class="repositoryContent" width="600px">
    <h3 class="repositoryContentHeader" slot="title" v-html="dialogTitle" />
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(v, k) in repoRoute" :key="k">
        <a href="#" @click.prevent="goToPath(v, k)">{{ v || 'ROOT' }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <ul class="repositoryContentItem" v-if="trees !== null">
      <li v-for="(tree, k) in trees.tree" :key="k">
        <el-link @click.native="showContent(tree)">
          <i :class="`el-icon-${content.type === 'blob' ? 'document' : 'folder'}`"></i>
          {{ tree.path }}
        </el-link>
      </li>
    </ul>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { State } from 'vuex-class'
import { GithubContent, GithubRepository, GithubTrees, GithubTree } from '@Domain/Github'
import { githubService } from '@/services'
import { Markdown } from '@/components'

const components = { Markdown }

@Component({ components })
export default class Repository extends Vue {

  //========== mapper ==========//
  @State(state => state.user.profile.login) user!: string
  @State(state => state.user.access_token) access_token!: string

  //========== data ==========//
  private opened = false
  private repository: GithubRepository|null = null
  private repoRoute: string[] = []
  private trees: GithubTrees|null = null

  //========== computed ==========//
  private get dialogTitle (): string {
    return this.repository !== null ? this.repository.name : ''
  }

  //========== methods ==========//

  showDirectory (trees: GithubTrees) {
    this.trees = trees
    // this.contents.sort((a: GithubContent, b: GithubContent) => {
    //   if (a.type !== b.type) {
    //     return a.type === 'file' ? 1 : -1
    //   } else {
    //     return a.name < b.name ? -1 : 1
    //   }
    // })
  }

  async open (repository: GithubRepository) {
    this.opened = true
    this.repository = repository

    const repo: string = this.repository.name
    const user: string = this.user

    this.repoRoute = ['']

    githubService
      .getTrees({ repo, user })
      .then(this.showDirectory)
  }

  async showContent (content: GithubTree) {
    const { type, path, sha } = content
    const repo: string = this.repository!.name
    const user: string = this.user

    const ext = path.replace(/.*\.(.*)/, '$1')
    const rawList = ['pdf', 'excel', 'doc', 'docx', 'hwp', 'ppt', 'xls']
    if (rawList.includes(ext)) {
      this.$message({ type: 'warning', message: `${ext} file은 조회할 수 없습니다.` })
      return
    }

    /*const data = await githubService.getContent({ repo, user, path })

    if (type === 'dir') {
      this.repoRoute.push(name)
      this.showDirectory(data)
    } else {
      const route = [
        ...this.repository!.full_name.split('/'),
        ...this.repoRoute.splice(1)
      ]
      this.$emit('show-content', [data, path, ext, route])
    }*/
  }

  goToPath (path: string, key: number) {
    if (key === this.repoRoute.length - 1) return

    const repo: string = this.repository!.name
    const user: string = this.user
    const route: string[] = [ ...this.repoRoute ]

    githubService
      .getContent({ repo, user, path })
      .then(this.showDirectory)
      .then(() => {
        // 경로 변경
        this.repoRoute = route.filter((v, k) => k <= key)
      })
  }
}
</script>