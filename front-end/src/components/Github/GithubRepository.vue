<template>
  <el-dialog :visible.sync="opened" class="repositoryContent" width="600px">
    <h3 class="repositoryContentHeader" slot="title" v-html="dialogTitle" />
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(v, k) in repoRoute" :key="k">
        <a href="#" @click.prevent="goToPath(v, k)">{{ v || 'ROOT' }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <ul class="repositoryContentItem">
      <li v-for="(content, k) in contents" :key="k">
        <el-link @click.native="showContent(content)">
          <i :class="`el-icon-${content.type === 'file' ? 'document' : 'folder'}`"></i>
          {{ content.name }}
        </el-link>
      </li>
    </ul>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { State } from 'vuex-class'
import { GithubContent, GithubRepository as GithubRepositoryType } from '@Domain/Github'
import { githubService } from '@/services'
import { Markdown } from '@/components'

const components = { Markdown }

@Component({ components })
export default class GithubRepository extends Vue {

  //========== mapper ==========//
  @State(state => state.user.profile.login) user!: string
  @State(state => state.user.access_token) access_token!: string

  //========== data ==========//
  private opened = false
  private repository: GithubRepositoryType|null = null
  private repoRoute: string[] = []
  private contents: GithubContent[] = []

  //========== computed ==========//
  private get dialogTitle (): string {
    return this.repository !== null ? this.repository.name : ''
  }

  //========== methods ==========//

  showDirectory (data: GithubContent|GithubContent[]) {
    this.contents = data as GithubContent[]
    this.contents.sort((a: GithubContent, b: GithubContent) => {
      if (a.type !== b.type) {
        return a.type === 'file' ? 1 : -1
      } else {
        return a.name < b.name ? -1 : 1
      }
    })
  }

  open (repository: GithubRepositoryType) {
    this.opened = true
    this.repository = repository

    const repo: string = this.repository.name
    const user: string = this.user

    this.repoRoute = ['']
    this.contents = []

    githubService
      .getContent({ repo, user, path: '' })
      .then(this.showDirectory)
  }

  async showContent (content: GithubContent) {
    const { type, path, name } = content
    const repo: string = this.repository!.name
    const user: string = this.user

    const ext = path.replace(/.*\.(.*)/, '$1')
    const rawList = ['pdf', 'excel', 'doc', 'docx', 'hwp', 'ppt', 'xls']
    if (rawList.includes(ext)) {
      this.$message({ type: 'warning', message: `${ext} file은 조회할 수 없습니다.` })
      return
    }

    const data = await githubService.getContent({ repo, user, path })

    if (type === 'dir') {
      this.repoRoute.push(name)
      this.showDirectory(data)
    } else {
      this.$emit('show-content', [data as GithubContent, path, ext, this.repoRoute])
    }
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