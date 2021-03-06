<template>
  <el-dialog title="포스트 수정하기" :visible.sync="opened" width="700px">
    <el-form v-if="opened && postData" :model="postData" ref="frm" label-width="100px" @submit.native.prevent="save">
      <el-form-item label="제목" size="small" prop="title" required>
        <el-input v-model="postData.title" />
      </el-form-item>
      <el-form-item label="간단한 설명" size="small" prop="description" required>
        <el-input type="textarea" v-model="postData.description" rows="5" cols="80" />
      </el-form-item>
      <el-form-item label="포스트 경로" size="small" prop="route" required>
        <el-row type="flex" justify="space-between">
          <el-col :span="22">
            <el-input v-model="postData.route" disabled />
          </el-col>
          <el-col :span="2">
            <el-button @click="$emit('open-link-editor')" type="default" icon="el-icon-edit-outline" plain />
          </el-col>
        </el-row>
        * 저장소에서 해당 파일의 위치가 변경되었을 경우 업데이트 해주세요
      </el-form-item>
      <el-form-item label="썸네일" size="small" prop="thumbnail">
        <label class="fileUploadLabel">
          <input ref="thumbnailInput" id="thumbnail" type="file" @change="thumbnailUpload" accept="image/*" />
          <span>썸네일 이미지 업로드</span>
        </label>
        <div class="thumbnail" v-if="postData.thumbnail">
          <div class="thumbnailWrap">
            <img :src="uploadedThumbnail" alt="썸네일 이미지" />
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
import { Post, PostVO } from 'domain/src'
import { namespace } from 'vuex-class'
import { ActionMethod } from 'vuex'

const postStore = namespace('post')

@Component
export default class PostEdit extends Vue {
  @postStore.Action private UPDATE_POST!: ActionMethod

  private postData: Post|null = null
  private opened: boolean = false
  private uploadedThumbnail: string = ''
  private reader: FileReader|null = null

  public open (postData: Post) {
    this.opened = true
    this.postData = postData
    if (postData.thumbnail) {
      this.uploadedThumbnail = `/uploaded/${postData.sha}`
    }
  }

  public close () {
    this.opened = false
  }

  private save () {
    const frm: any = this.$refs.frm
    frm.validate(async (valid: boolean) => {
      if (!valid) return false
      await this.UPDATE_POST([ this.postData, this.uploadedThumbnail ])
      this.$message({ type: 'success', message: '수정 되었습니다.' })
      this.opened = false
    })
  }

  private thumbnailUpload ({ target: { files } }: { target: { files: FileList } }) {
    files.length && this.reader!.readAsDataURL(files[0])
  }

  private thumbnailEdit () {
    const input = this.$refs.thumbnailInput as HTMLInputElement
    input.click()
  }

  private thumbnailDelete () {
    const input = this.$refs.thumbnailInput as HTMLInputElement
    input.value = ''
    this.postData!.thumbnail = false
  }

  @Emit()
  public updateRoute ({ content, repository, route }: PostVO) {
    this.postData!.content = content
    this.postData!.repository = repository
    this.postData!.route = route
  }

  private mounted () {
    const reader: FileReader = new FileReader()
    this.reader = reader
    reader.onloadend = (e: any) => {
      this.postData!.thumbnail = true
      this.uploadedThumbnail = e.target!.result
    }
  }
}
</script>