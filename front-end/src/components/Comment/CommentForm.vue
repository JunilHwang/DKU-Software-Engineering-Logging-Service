<template>
  <el-form class="commentForm" :model="commentDetail">
    <h3>
      <i class="el-icon-chat-dot-round" />
      댓글 작성
    </h3>
    <el-form-item prop="content" size="mini">
      <el-input type="textarea" class="commentFormTextarea" rows="3" v-model="commentDetail.content" />
    </el-form-item>
    <el-form-item class="commentFormButton" size="small">
      <el-button type="primary" native-type="submit" icon="el-icon-check">작성완료</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CommentForm extends Vue {
  private commentDetail = {
    content: ''
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
    background: #fcfcfc;
  }

  &Button {
    text-align: right;
    margin-bottom: 0 !important;
  }
}
</style>