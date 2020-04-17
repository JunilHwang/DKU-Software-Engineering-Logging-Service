<template>
  <el-dialog :visible.sync="opened" width="600px">
    <h3 slot="title">
      <i class="el-icon-chat-dot-round" />
      {{ title }}
    </h3>
    <el-form :model="commentDetail" ref="frm" @submit.native.prevent="commentSubmit">
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
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { ActionMethod } from 'vuex'
import { Comment } from 'domain/src'

const commentStore = namespace('comment')

@Component
export default class CommentForm extends Vue {
  @Prop({ type: String, default: '' }) private content!: string
  @Prop({ type: Number, default: 0 }) private parent!: number
  @commentStore.State('selectedComment') private comment!: Comment|null
  @commentStore.Action private FETCH_ONE_COMMENT!: ActionMethod
  @commentStore.Action private ADD_COMMENT!: ActionMethod
  @commentStore.Action private UPDATE_COMMENT!: ActionMethod

  private opened: boolean = false
  private title: string = '댓글 수정'
  private commentDetail = {
    content: ''
  }
  private type: 'reply'|'update' = 'update'

  private get isValid (): boolean {
    return this.commentDetail.content.length > 0
  }

  private async commentReply (): Promise<void> {
    const comment: Comment = this.comment!
    await this.ADD_COMMENT({
      parent: comment.parent === 0 ? comment.idx : comment.parent,
      to: comment.writer.id,
      post: this.$route.params.idx,
      content: this.commentDetail.content
    })
    this.commentDetail.content = ''
    this.$message({ type: 'success', message: '답글 작성이 완료되었습니다.' })
    this.opened = false
  }

  private async commentUpdate (): Promise<void> {
    await this.UPDATE_COMMENT({
      idx: this.comment!.idx,
      content: this.commentDetail.content
    })
    this.commentDetail.content = ''
    this.opened = false
    this.$message({ type: 'success', message: '댓글이 수정되었습니다.' })
  }

  private commentSubmit () {
    this.type === 'update'
      ? this.commentUpdate()
      : this.commentReply()
  }

  public async open ({ idx, type }: { idx: number, type: 'reply'|'update' }) {
    const isUpdate = type === 'update'
    await this.FETCH_ONE_COMMENT(idx)
    this.opened = true
    this.type = type
    this.title = isUpdate ? '댓글 수정' : '답글 작성'
    this.commentDetail.content = isUpdate ? this.comment!.content : ''
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 0;
  font-size: 21px;
  font-weight: normal;

  i {
    display: inline-block;
    transform: translateY(2px);
  }
}
</style>