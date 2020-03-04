<template>
  <el-dialog :title="contentTitle" :visible.sync="opened" width="700px">
    <markdown />
    <img v-if="contentIsImage" :src="contentImageSource" :alt="contentTitle" style="max-width: 100%" />
  </el-dialog>
</template>

<script lang="ts">
  import { Vue, Component} from 'vue-property-decorator'
  import {Mutation, State} from 'vuex-class'
  import { Base64 } from 'js-base64'
  import { GithubContent as GithubContentType } from '@Domain/Github'
  import { FETCH_GITHUB_CONTENT } from '@/middleware/store/types/MutationType'
  import { MutationMethod } from 'vuex'
  import { Markdown } from '@/components'

  const components = { Markdown }

  @Component({ components })
  export default class GithubContent extends Vue {

    //========== mapper ==========//
    @Mutation(FETCH_GITHUB_CONTENT) fetch!: MutationMethod

    private opened: boolean = false
    private contentIsImage: boolean = false
    private contentImageSource: string = ''
    private contentTitle: string = ''

    open (githubContent: GithubContentType, path: string, ext: string, route: string[]) {
      this.opened = true
      this.contentTitle = [...route, githubContent.name].join('/')
      this.contentImageSource = ''

      const imageList = ['jpg', 'jpeg', 'gif', 'png', 'svg']

      if (imageList.includes(ext)) {
        this.contentIsImage = true
        this.contentImageSource = githubContent.download_url!
      } else {
        this.contentIsImage = false
        let content = Base64.decode(githubContent.content!)
        if (ext !== 'md') {
          content = '``` ' + ext + '\n' + content + '\n```';
        }
        this.fetch(content)
      }
    }
  }
</script>