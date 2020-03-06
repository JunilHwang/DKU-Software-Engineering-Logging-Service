<template>
  <el-dialog :title="contentTitle" :visible.sync="opened" width="800px">
    <markdown>
      <template slot="footer">
        <div class="btnGroup right">
          <el-button type="primary" size="mini" @click="save">
            컨텐츠 등록하기
          </el-button>
        </div>
      </template>
    </markdown>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import { Base64 } from 'js-base64'
import { GithubBlob, ContentVO } from '@Domain'
import { FETCH_GITHUB_CONTENT } from '@/middleware/store/types/MutationType'
import { MutationMethod } from 'vuex'
import { Markdown } from '@/components/Code'

const components = { Markdown }

@Component({ components })
export default class Content extends Vue {

  @State(state => state.github.content) rawContent!: string
  @Mutation(FETCH_GITHUB_CONTENT) fetch!: MutationMethod

  private opened: boolean = false
  private contentTitle: string = ''
  private repository: string = ''
  private sha: string = ''

  open (blob: GithubBlob, route: string[], { user, repo, sha }: ContentVO) {
    this.repository = `${user}/${repo}`
    this.sha = sha!
    this.opened = true
    this.contentTitle = route.join('/')

    const content = Base64.decode(blob.content)

    this.fetch({ content, route })
  }

  save () {
    const { repository, sha } = this
    console.log(repository, sha)
  }
}
</script>