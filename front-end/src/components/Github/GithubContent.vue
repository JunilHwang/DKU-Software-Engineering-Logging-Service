<template>
  <el-dialog :title="contentTitle" :visible.sync="opened" width="800px">
    <markdown>
      <template slot="footer">
        this is content test
      </template>
    </markdown>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import { Base64 } from 'js-base64'
import { GithubBlob } from '@Domain/Github'
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

  open (blob: GithubBlob, route: string[]) {
    this.opened = true
    this.contentTitle = route.join('/')
    const content = Base64.decode(blob.content)

    this.fetch({ content, route })
  }
}
</script>