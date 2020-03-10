<template>
  <el-dialog v-if="opened" :visible.sync="opened" title="마크다운 파일 링크 입력" width="600px">
    <el-form :model="formData"  label-width="100px" @submit.native.prevent="previewContent">
      <el-form-item label="링크 입력" prop="link" size="small" required>
        <el-input v-model="formData.link" />
      </el-form-item>
      <el-form-item size="small">
        <el-button native-type="submit" type="primary">미리보기</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { eventBus } from '@/helper'
import { githubClientService } from '@/services'
import { Response, GithubContent } from '@Domain'

@Component
export default class GithubLinkEditor extends Vue {
  private opened = false
  private formData = {
    link: ''
  }

  private open () {
    this.opened = true
  }

  private async previewContent () {
    const link: string = this.formData.link
    const type = 'error'
    const message = '유효하지 않은 링크입니다.'

    if (!link.includes('https://github.com')) {
      this.$message({ type, message })
      return
    }

    const reg: RegExp = link.includes('/blob/') ? /(https?:\/\/.*?\/)(.*?\/.*?)\/(blob\/.*?)\/(.*)/ : /(https?:\/\/.*?\/)(.*)/
    const match: any = this.formData.link.match(reg)
    const [user, repo] = match[2].split('/')
    const path = match[4] || 'README.md'

    if ([user, repo, path].includes(undefined)) {
      this.$message({ type, message })
      return
    }

    const { success, result }: Response<GithubContent> = await githubClientService.getContent({ user, repo, path })
    if (!success) {
      this.$message({ type, message })
      return
    }


  }

  created () {
    eventBus.$on('openLinkEditor', this.open)
  }
}
</script>