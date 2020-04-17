<template>
  <el-dialog v-if="opened" :visible.sync="opened" title="마크다운 파일 링크 입력" width="600px">
    <el-form :model="formData"  label-width="100px" @submit.native.prevent="showContent" v-if="opened">
      <el-form-item label="링크 입력" prop="link" size="small" required autofocus>
        <el-input v-model="formData.link" />
      </el-form-item>
      <el-form-item size="small">
        <el-button native-type="submit" type="primary">미리보기</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { eventBus } from '@/helper'
import { githubClientService } from '@/services'
import { GithubProfile } from 'domain/src'

const userStore = namespace('user')

@Component
export default class GithubLinkEditor extends Vue {
  @userStore.State private profile!: GithubProfile|null

  private opened = false
  private formData = {
    link: ''
  }

  public open () {
    this.opened = true
    this.formData.link = ''
  }

  public close () {
    this.opened = false
  }

  @Emit()
  private async showContent () {
    const link: string = this.formData.link
    const type = 'error'
    const message = '유효하지 않은 링크입니다.'

    if (!link.includes('https://github.com')) {
      this.$message({ type, message })
      return null
    }

    const reg: RegExp = link.includes('/blob/') ? /(https?:\/\/.*?\/)(.*?\/.*?)\/(blob\/.*?)\/(.*)/ : /(https?:\/\/.*?\/)(.*)/
    const match: any = this.formData.link.match(reg)
    const [user, repo] = match[2].split('/')
    const path = match[4] || 'README.md'

    if (!path.includes('.md')) {
      this.$message({ type, message: 'Markdown 파일만 가져올 수 있습니다.' })
      return null
    }

    if (this.profile && this.profile.login.toLowerCase() !== user.toLowerCase()) {
      this.$message({ type, message: '다른 사용자의 컨텐츠는 가져올 수 없습니다.' })
      return null
    }

    if ([user, repo, path].includes(undefined)) {
      this.$message({ type, message })
      return null
    }

    const result = await githubClientService.getContent({ user, repo, path })

    const { content, sha } = result!

    return [content, [user, repo, path], sha]
  }

  created () {
    eventBus.$on('openLinkEditor', this.open)
  }

}
</script>