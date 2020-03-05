<template>
  <el-dialog :title="contentTitle" :visible.sync="opened" width="800px">
    <markdown v-if="rawContent.length" />
    <img v-if="contentIsImage" :src="contentImageSource" :alt="contentTitle" style="max-width: 100%" />
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import {Mutation, State} from 'vuex-class'
import { Base64 } from 'js-base64'
import { GithubContent } from '@Domain/Github'
import { FETCH_GITHUB_CONTENT } from '@/middleware/store/types/MutationType'
import { MutationMethod } from 'vuex'
import { Markdown } from '@/components/Code'

const components = { Markdown }

@Component({ components })
export default class Content extends Vue {

  @State(state => state.github.content) rawContent!: string
  @Mutation(FETCH_GITHUB_CONTENT) fetch!: MutationMethod

  private opened: boolean = false
  private contentIsImage: boolean = false
  private contentImageSource: string = ''
  private ext: string = ''
  private name: string = ''
  private route: string[] = []

  private get contentTitle () {
    return [...this.route, this.name].join('/')
  }

  imageRender (url: string) {
    this.contentImageSource = url
    this.fetch({ content: '', route: '' })
  }

  markdownRender (rawContent: string) {
    const { ext, route } = this
    let content = Base64.decode(rawContent)

    if (ext !== 'md') {
      content = '``` ' + ext + '\n' + content + '\n```';
    }

    this.fetch({ content, route })
  }

  open (githubContent: GithubContent, path: string, ext: string, route: string[]) {

    const imageList = ['jpg', 'jpeg', 'gif', 'png', 'svg']
    const { download_url, content, name } = githubContent!

    this.name = name
    this.ext = ext
    this.route = route
    this.opened = true
    this.contentIsImage = imageList.includes(ext)

    this.contentIsImage
      ? this.imageRender(download_url)
      : this.markdownRender(content!)
  }
}
</script>