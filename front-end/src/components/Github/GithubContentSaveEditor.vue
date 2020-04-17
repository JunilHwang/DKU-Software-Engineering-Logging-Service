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
import { Vue, Component, Emit } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { ActionMethod } from 'vuex'
import { PostVO } from 'domain/src'
import { eventBus, getFrontMatter } from '@/helper'

const reader: FileReader|null = typeof window !== 'undefined' ? new FileReader() : null;
const postStore = namespace('post')

@Component
export default class GithubContentSaveEditor extends Vue {

  @postStore.Action private ADD_POST!: ActionMethod

  private opened: boolean = false
  private postData: PostVO = {
    title: '',
    content: '',
    sha: '',
    repository: '',
    thumbnail: '',
    description: '',
    route: ''
  }
  private thumbnailLoaded: boolean = false

  public open (postVO: PostVO) {
    const frontMatter = getFrontMatter(postVO.content)
    const title = frontMatter ? frontMatter.title : ''
    this.opened = true
    this.thumbnailLoaded = false
    this.postData = { ...postVO, title, thumbnail: '', description: '' }
  }

  public close () {
    this.opened = false
  }

  @Emit('all-close')
  private save () {
    const frm: any = this.$refs.frm
    frm.validate(async (valid: boolean) => {
      if (!valid) return false
      await this.ADD_POST(this.postData)
      this.$message({ type: 'success', message: '포스트가 등록되었습니다.' })
      eventBus.$emit('fetchPostAll')
      this.opened = false
    })
  }

  private thumbnailUpload ({ target: { files } }: { target: { files: FileList } }) {
    files.length && reader && reader.readAsDataURL(files[0])
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

  private created () {
    if (reader === null) return
    reader.onloadend = (e: any) => {
      const thumbnail = e.target!.result as string
      this.postData = { ...this.postData, thumbnail }
      this.thumbnailLoaded = true
    }
  }
}
</script>