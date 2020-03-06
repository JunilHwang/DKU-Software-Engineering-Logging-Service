<template>
  <el-dialog :title="contentTitle" :visible.sync="opened" width="800px">
    <markdown>
      <template slot="footer">
        <div class="btnGroup right">
          <el-button type="primary" size="mini" @click="saveEditing">
            컨텐츠 등록하기
          </el-button>
        </div>
      </template>
    </markdown>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { MutationMethod } from 'vuex'
import { Mutation, State } from 'vuex-class'
import { Base64 } from 'js-base64'
import { GithubBlob, ContentVO } from '@Domain'
import { ADD_POST, FETCH_GITHUB_CONTENT } from '@/middleware/store/types'
import { Markdown } from '@/components/Code'

const components = { Markdown }
const rawURL = 'https://raw.githubusercontent.com'

@Component({ components })
export default class Content extends Vue {

  @State(state => state.github.content) rawContent!: string
  @Mutation(FETCH_GITHUB_CONTENT) fetch!: MutationMethod
  @Mutation(ADD_POST) addPost!: MutationMethod

  private opened: boolean = false
  private contentTitle: string = ''
  private repository: string = ''
  private sha: string = ''
  private content: string = ''

  open (blob: GithubBlob, route: string[], { user, repo, sha }: ContentVO) {
    this.repository = `${user}/${repo}`
    this.sha = sha!
    this.opened = true
    this.contentTitle = route.join('/')

    const head = [...route].splice(0, 2).join('/')
    const tail = [...route].splice(2).join('/')
    const reg = /!\[(.*)\]\(([.|/].*)\)/gim
    const content = Base64.decode(blob.content).replace(reg,`![$1](${rawURL}/${head}/master/${tail}/../$2)`)

    console.log(content)

    this.content = content

    this.fetch({ content, route })
  }

  saveEditing () {
    const { content, repository, sha } = this
    this.$emit('save-editing', { content, repository, sha })
  }
}
</script>