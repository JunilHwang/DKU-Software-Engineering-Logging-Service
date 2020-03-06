<template>
  <el-dialog title="포스트 저장하기" :visible.sync="opened">
    <el-form :model="postData" label-width="100px" @submit.native.prevent="save">
      <el-form-item label="제목" size="small" prop="title" required>
        <el-input v-model="postData.title" />
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary" size="small">저장</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PostVO } from '@Domain'
import { getFrontMatter } from '@/helper'

@Component
export default class GithubContentSaveEditor extends Vue {
  private opened: boolean = false
  private postData: PostVO = {
    title: '',
    content: '',
    sha: '',
    repository: ''
  }

  public open (postVO: PostVO) {
    const title = getFrontMatter(postVO.content).title || ''
    this.opened = true
    this.postData = { title, ...postVO }
  }

  private save () {
    console.log(this.postData)
  }
}
</script>