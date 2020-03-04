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
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(v, k) in repoRoute" :key="k">
          <a href="#" @click.prevent="goToPath(v, k)">{{ v || 'ROOT' }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <ul class="repositoryContentItem">
        <li v-for="(content, k) in contents" :key="k">
          <el-link @click.native="viewContents(content)">
            <i :class="`el-icon-${content.type === 'file' ? 'document' : 'folder'}`"></i>
            {{ content.name }}
          </el-link>
        </li>
      </ul>
    </el-dialog>
    <el-dialog :title="contentTitle" :visible.sync="contentOpened" width="700px">
      <markdown v-if="decodedContent.length" :content="decodedContent" />
      <template v-if="contentIsImage">
        <img :src="contentImageSource" :alt="contentTitle">
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { Action, State } from 'vuex-class'
import { Base64 } from 'js-base64'
import { GithubProfile, GithubRepository, GithubContent } from '@Domain/Github'
import { FETCH_REPO } from '@/middleware/store/MutationType'
import { githubService } from '@/services'
import { Markdown } from '@/components/Code'

const components = { Markdown }

@Component({ components })
export default class Repository extends Vue {

  //========== mapper ==========//
  @State(state => state.github.repositories) repositories!: Array<GithubRepository>
  @State(state => state.user.profile) profile!: GithubProfile
  @State(state => state.user.access_token) access_token!: string
  @Action(FETCH_REPO) fetchRepo!: ActionMethod

  //========== data ==========//
  private opened = false
  private contentOpened = false
  private selected: GithubRepository|null = null
  private repoRoute: string[] = []
  private contents: GithubContent[] = []
  private repo: string = ''
  private contentFileName: string = ''
  private decodedContent: string = ''
  private contentIsImage: boolean = false
  private contentImageSource: string = ''

  //========== computed ==========//
  private get dialogTitle (): string {
    return this.selected !== null ? this.selected.name : ''
  }

  private get contentTitle (): string {
    const { repoRoute, contentFileName } = this
    return [...repoRoute, contentFileName].join('/')
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

  showContents (repository: GithubRepository) {
    const user: string = this.profile.login
    const repo: string = this.repo = repository.name
    this.opened = true
    this.selected = repository

    this.repoRoute = ['']
    this.contents = []

    githubService
      .getContent({ repo, user, path: '' })
      .then(this.showDirectory)
  }

  async viewContents ({ type, path, name }: GithubContent) {

    const user: string = this.profile.login
    const { repo } = this

    this.decodedContent = this.contentImageSource = ''

    const ext = path.replace(/.*\.(.*)/, '$1')
    const imageList = ['jpg', 'jpeg', 'gif', 'png', 'svg']
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
      const githubContent: GithubContent = data as GithubContent
      this.contentFileName = githubContent.name

      this.contentOpened = true
      if (imageList.includes(ext)) {
        console.log(githubContent)
        this.contentIsImage = true
        this.contentImageSource = githubContent.download_url!
      } else {
        this.contentIsImage = false
        this.decodedContent = Base64.decode(githubContent.content!)
        if (ext !== 'md') {
          this.decodedContent = '``` ' + ext + '\n' + this.decodedContent + '\n```';
        }
      }
    }
  }

  goToPath (path: string, key: number) {
    if (key === this.repoRoute.length - 1) return

    const repo: string = this.repo
    const user: string = this.profile.login

    githubService
      .getContent({ repo, user, path })
      .then(this.showDirectory)
      .then(() => {
        // 경로 변경
        this.repoRoute = [ ...this.repoRoute ].filter((v, k) => k <= key)
      })
  }

  //========== life cycle ==========//

  created () {
    this.fetchRepo()
  }
}
</script>
