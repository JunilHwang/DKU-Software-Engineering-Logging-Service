<template>
  <el-dialog title="포스트 저장하기" :visible.sync="opened" width="600px">
    <el-form v-if="opened" :model="postData" ref="frm" label-width="100px" @submit.native.prevent="save">
      <el-form-item label="제목" size="small" prop="title" required>
        <el-input v-model="postData.title" />
      </el-form-item>
      <el-form-item label="간단한 설명" size="small" prop="description" required>
        <el-input type="textarea" v-model="postData.description" rows="5" cols="80" />
      </el-form-item>
      <el-form-item label="썸네일" size="small" prop="thumbnail">
        <label class="fileUploadLabel">
          <input ref="thumbnailInput" id="thumbnail" type="file" @change="thumbnailUpload" accept="image/*" />
          <span>썸네일 이미지 업로드</span>
        </label>
        <div class="thumbnail" v-if="thumbnailLoaded">
          <div class="thumbnailWrap">
            <img :src="postData.thumbnail" alt="썸네일 이미지" />
            <div class="thumbnailEdit">
              <el-button @click="thumbnailEdit" type="primary" icon="el-icon-edit" size="small" circle />
              <el-button @click="thumbnailDelete" type="danger" icon="el-icon-delete" size="small" circle />
            </div>
          </div>
        </div>
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
import {eventBus, getFrontMatter} from '@/helper'
import { postService } from '@/services'

const reader: FileReader = new FileReader()

@Component
export default class GithubContentSaveEditor extends Vue {

  private opened: boolean = false
  private postData: PostVO = {
    title: '',
    content: '',
    sha: '',
    repository: '',
    thumbnail: '',
    description: ''
  }
  private thumbnailLoaded: boolean = false

  public open (postVO: PostVO) {
    const frontMatter = getFrontMatter(postVO.content)
    const title = frontMatter ? frontMatter.title : ''
    this.opened = true
    this.postData = { ...postVO, title, thumbnail: '', description: '' }
  }

  private save () {
    const frm: any = this.$refs.frm
    frm.validate(async (valid: boolean) => {
      if (!valid) return false

      const isSuccess = await postService.create(this.postData)

      console.log(isSuccess)

      this.$message({ type: 'info', message: isSuccess ? '포스트가 등록되었습니다.' : '이미 등록된 포스트입니다.' })

      if (isSuccess) {
        eventBus.$emit('fetchPostAll')
      }

      this.opened = false
      this.$emit('all-close')
    })
  }

  private thumbnailUpload (e: any) {
    e.target.files.length
    && reader.readAsDataURL(e.target.files[0])
  }

  private thumbnailEdit () {
    const input = this.$refs.thumbnailInput as HTMLInputElement
    input.click()
  }

  private thumbnailDelete () {
    const input = this.$refs.thumbnailInput as HTMLInputElement
    input.value = ''
    this.thumbnailLoaded = false
  }

  created () {
    reader.onloadend = (e: any) => {
      const thumbnail = e.target!.result as string
      this.postData = { ...this.postData, thumbnail }
      this.thumbnailLoaded = true
    }
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
.thumbnail {
  display: block;
  &Wrap {
    margin-top: 10px;
    position: relative;
    display: inline-block;

    img {
      vertical-align: middle;
      border: 2px dashed #ddd;
      max-width: 400px;
      max-height: 300px;
    }
  }
  &Edit {
    position: absolute;
    left:0;
    top:0;
    bottom:0;
    right: 0;
    background: fade-out(#000, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
  }
}
</style>