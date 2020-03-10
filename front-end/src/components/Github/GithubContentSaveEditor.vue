<template>
  <el-dialog title="포스트 저장하기" :visible.sync="opened" width="600px">
    <el-form v-if="opened" :model="postData" ref="frm" label-width="100px" @submit.native.prevent="save">
      <el-form-item label="제목" size="small" prop="title" required>
        <el-input v-model="postData.title" />
      </el-form-item>
      <el-form-item label="간단한 설명" size="small" prop="description" required>
        <el-input type="textarea" v-model="postData.description" rows="5" cols="80" />
      </el-form-item>
      <el-form-item label="썸네일" size="small" prop="thumbnail" required>
        <el-input v-model="postData.thumbnail" v-show="false" />
        <label class="fileUploadLabel">
          <input id="thumbnail" type="file" />
          <span>썸네일 이미지 업로드</span>
        </label>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary" size="small">저장</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { Action } from 'vuex-class'
import { PostVO } from '@Domain'
import {eventBus, getFrontMatter} from '@/helper'
import { ADD_POST } from '@/middleware/store/types'

@Component
export default class GithubContentSaveEditor extends Vue {

  @Action(ADD_POST) addPost!: ActionMethod

  private opened: boolean = false
  private postData: PostVO = {
    title: '',
    content: '',
    sha: '',
    repository: '',
    thumbnail: '',
    description: ''
  }

  public open (postVO: PostVO) {
    const title = getFrontMatter(postVO.content).title || ''
    this.opened = true
    this.postData = { title, ...postVO }
  }

  private save () {
    const frm: any = this.$refs.frm
    frm.validate(async (valid: boolean) => {
      if (!valid) return false

      const isSuccess = await this.addPost(this.postData)

      this.$message({ type: 'info', message: isSuccess ? '포스트가 등록되었습니다.' : '이미 등록된 포스트입니다.' })

      if (isSuccess) {
        eventBus.$emit('fetchPostAll')
      }

      this.opened = false
    })
  }
}
</script>

<style lang="scss">
.fileUploadLabel {
  input {
    display: none
  }
  span {
    display: inline-block;
    border-radius: 3px;
    background: #f0f9eb;
    color: #67c23a;
    border: 1px solid #c2e7b0;
    font-size: 13px;
    padding: 0 10px;
    cursor: pointer;

    &:hover {
      background: #67c23a;
      border-color: #67c23a;
      color: #fff;
    }
  }
}
</style>