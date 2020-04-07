<template>
  <el-dialog :title="contentTitle" :visible.sync="opened" width="800px">
    <markdown :content="content" v-if="opened">
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
  import {Vue, Component, Emit} from 'vue-property-decorator'
import { Base64 } from 'js-base64'
import { Markdown } from '@/components/Markdown'

const components = { Markdown }
const rawURL = 'https://raw.githubusercontent.com'
const githubURL = 'https://github.com'

@Component({ components })
export default class Content extends Vue {

  private opened: boolean = false
  private contentTitle: string = ''
  private repository: string = ''
  private sha: string = ''
  private content: string = ''
  private route: string[] = []

  public open (content: string, route: string[], sha: string) {
    this.sha = sha!
    this.opened = true
    this.route = route
    this.contentTitle = route.join('/')
    const head = [...route].splice(0, 2).join('/')

    const tail = [...route].splice(2).join('/')

    this.repository = head
    this.content = Base64.decode(content)
                    .replace(
                      /!\[(.*)\]\(([.|/].*)\)/gim,
                      `![$1](${rawURL}/${head}/master/${tail}/../$2)`)
                    .replace(
                      /\[(.*)\]\(([.|/].*)\)/gim,
                      `[$1](${githubURL}/${head}/tree/master/${tail}/../$2)`)

  }

  public close () {
    this.opened = false
  }

  @Emit()
  saveEditing () {
    const { content, repository, route, sha } = this
    return { content, repository, route: route.join('/'), sha }
  }
}
</script>