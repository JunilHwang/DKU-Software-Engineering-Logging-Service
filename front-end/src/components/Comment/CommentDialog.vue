<template>
  <el-dialog :visible.sync="opened" width="600px">
    <h3 slot="title">
      <i class="el-icon-chat-dot-round" />
      {{ title }}
    </h3>
    <el-form :model="commentDetail" @submit.native.prevent="commentSubmit">
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
import { Action, State } from 'vuex-class'
import {ADD_COMMENT, FETCH_ONE_COMMENT} from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { Comment } from '@Domain'

@Component
export default class CommentForm extends Vue {
  @Prop({ type: String, default: '' }) content!: string
  @Prop({ type: Number, default: 0 }) parent!: number
  @State(state => state.comment.selectedComment) comment!: Comment|null
  @Action(FETCH_ONE_COMMENT) fetch!: ActionMethod
  @Action(ADD_COMMENT) add!: ActionMethod

  private opened: boolean = false
  private title: string = '댓글 수정'
  private commentDetail = {
    content: ''
  }

  private get isValid (): boolean {
    return this.commentDetail.content.length > 0
  }

  private async commentSubmit (): Promise<void> {
    try {
      await this.add({
        content: this.commentDetail.content,
        parent: this.parent,
        post: parseInt(this.$route.params.idx)
      })
      this.commentDetail.content = ''
      this.$message({ type: 'success', message: '댓글이 추가되었습니다.' })
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 댓글을 추가할 수 없습니다.' })
    }
  }

  public async open (idx: number) {
    try {
      await this.fetch(idx)
      this.opened = true
      this.commentDetail.content = this.comment!.content
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 댓글 정보를 가져올 수 없습니다.' })
    }
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