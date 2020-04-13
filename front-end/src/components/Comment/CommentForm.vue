<template>
  <el-form class="commentForm" :model="commentDetail" @submit.native.prevent="commentSubmit">
    <h3>
      <i class="el-icon-chat-dot-round" />
      댓글 작성
    </h3>
    <el-form-item size="mini">
      <el-input
        type="textarea"
        class="commentFormTextarea"
        rows="3"
        v-model="commentDetail.content"
      />
    </el-form-item>
    <el-form-item class="commentFormButton" size="small">
      <el-button
        :type="isValid ? 'primary' : 'default'"
        :native-type="isValid ? 'submit' : 'button'"
        icon="el-icon-check">
        작성완료
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { ActionMethod } from 'vuex'

const userStore = namespace('user')
const commentStore = namespace('comment')

@Component
export default class CommentForm extends Vue {
  @Prop({ type: String, default: '' }) private content!: string
  @Prop({ type: Number, default: 0 }) private parent!: number
  @commentStore.Action private ADD_COMMENT!: ActionMethod
  @userStore.State private access_token!: string|null

  private commentDetail = {
    content: ''
  }

  private get isValid (): boolean {
    return this.commentDetail.content.length > 0
  }

  private async commentSubmit (): Promise<void> {
    await this.ADD_COMMENT({
      content: this.commentDetail.content,
      parent: this.parent,
      post: parseInt(this.$route.params.idx)
    })
    this.commentDetail.content = ''
    this.$message({ type: 'success', message: '댓글이 추가되었습니다.' })
  }

  private created (): void {
    this.commentDetail.content = this.content
  }
}
</script>

<style lang="scss">
.commentForm {

  h3 {
    margin-top: 0;
    font-weight: 400;
  }

  .el-icon-chat-dot-round {
    display: inline-block;
    transform: translateY(2px);
  }

  &Textarea textarea {
    font-family: inherit;
    padding: 10px;
    font-size: 15px;
    line-height: 1.6;
    background-color: #fcfcfc;
  }

  &Button {
    text-align: right;
    margin-bottom: 0 !important;
  }
}
</style>