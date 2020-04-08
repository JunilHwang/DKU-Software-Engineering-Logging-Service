<template>
  <el-dialog title="포스트 수정하기" :visible.sync="opened" width="700px">
    <el-form v-if="opened" :model="postData" ref="frm" label-width="100px" @submit.native.prevent="save">
      <el-form-item label="제목" size="small" prop="title" required>
        <el-input v-model="postData.title" />
      </el-form-item>
      <el-form-item label="간단한 설명" size="small" prop="description" required>
        <el-input type="textarea" v-model="postData.description" rows="5" cols="80" />
      </el-form-item>
      <el-form-item label="포스트 경로" size="small" prop="route" required>
        <el-row type="flex" justify="space-between">
          <el-col span="22">
            <el-input v-model="postData.route" disabled />
          </el-col>
          <el-col span="2">
            <el-button type="default" icon="el-icon-edit-outline" plain />
          </el-col>
        </el-row>
        * 저장소에서 해당 파일의 위치가 변경되었을 경우 업데이트 해주세요
      </el-form-item>
      <el-form-item label="썸네일" size="small" prop="thumbnail">
        <label class="fileUploadLabel">
          <input ref="thumbnailInput" id="thumbnail" type="file" @change="thumbnailUpload" accept="image/*" />
          <span>썸네일 이미지 업로드</span>
        </label>
        <div class="thumbnail" v-if="loadedThumbnail">
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Post } from '@Domain'

@Component
export default class PostEdit extends Vue {
  private postData: Post|null = null

  private opened: boolean = false
  private loadedThumbnail: boolean = false
  private uploadedThumbnail: string = ''

  public open (postData: Post) {
    this.opened = true
    this.postData = postData
  }

  private save () { }
  private thumbnailUpload () { }
  private thumbnailEdit () { }
  private thumbnailDelete () { }
}
</script>