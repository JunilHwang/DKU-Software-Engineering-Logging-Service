<template>
  <section>

    <header>
      <h2><i class="el-icon-chat-round" /> 댓글 {{ commentList.length }}</h2>
    </header>

    <article
      v-for="{ idx, depth, content, writer: { id, profile: { avatar_url } }, createdAt, deleted } in commentList"
      :key="idx"
      :style="{ marginLeft: `${depth * 20}px` }"
      :class="{ reply: depth > 0 }"
    >
      <span class="replyIcon" />
      <ul v-if="!deleted">
        <li class="commentWriter">
          <figure>
            <img :src="`${avatar_url}&s=30`" :alt="id">
          </figure>
          <span class="commentWriterID" v-html="id" />
        </li>
        <li class="commentCreatedAt">{{ createdAt*1 | fromNow }}</li>
        <li class="commentEdit" v-if="userProfile !== null && userProfile.login === id">
          <el-button type="default" size="mini" icon="el-icon-edit-outline" plain circle />
          <el-button type="danger" @click="remove(idx)" size="mini" icon="el-icon-delete" plain circle />
        </li>
      </ul>
      <div class="commentContent" v-html="deleted ? '삭제된 댓글입니다.' : content" />
    </article>
    <p class="noComment" v-if="commentList.length === 0">
      작성된 댓글이 없습니다.
    </p>

  </section>
</template>

<script lang="ts">
  import {Vue, Component, Emit} from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { Action, State } from 'vuex-class'
  import {DELETE_COMMENT, FETCH_COMMENT} from '@/middleware/store/types'
import { Comment, GithubProfile } from '@Domain'
import CommentForm from './CommentForm.vue'

const components = { CommentForm }

@Component({ components })
export default class CommentList extends Vue {

  @Action(FETCH_COMMENT) fetchComment!: ActionMethod
  @Action(DELETE_COMMENT) deleteComment!: ActionMethod
  @State(state => state.comment.commentList) commentList!: Comment[]
  @State(state => state.user.profile) userProfile!: GithubProfile|null

  async created (): Promise<void> {
    try {
      await this.fetchComment(this.$route.params.idx)
    } catch (e) {
      this.$message({ type: 'error', message: '댓글을 가져오는 동안 오류가 발생했습니다.' })
    }
  }

  remove (idx: number): void {
    const confirmMsg: string = '정말로 삭제하시겠습니까?'
    const confirmTitle: string = '댓글 삭제'
    const confirmOption = {
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      type: 'warning'
    }

    const confirmed = async (): Promise<void> => {
      const post = this.$route.params.idx
      try {
        await this.deleteComment({idx, post})
        this.$message({ type: 'success', message: '댓글이 삭제되었습니다.' })
      } catch (e) {
        this.$message({ type: 'error', message: '오류로 인하여 댓글을 삭제할 수 없습니다.' })
      }
    }
    const cancel = () => this.$message({ type: 'info', message: '취소되었습니다.' })

    this.$confirm(confirmMsg, confirmTitle, confirmOption).then(confirmed).catch(cancel)
  }

}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/lib";

ul, li, div, section, header, article, p, figure {
  margin: 0;
  padding: 0;
}

img {
  vertical-align: middle;
}

ul, li {
  list-style: none;
  display: flex;
  align-items: center;
}

ul {
  font-family: enFont();
}

section {
  margin-bottom: 30px;
}

header {
  margin-bottom: 10px;
}

h2 {
  font-weight: 400;
  margin: 0;
  font-size: 21px;
}

.el-icon-chat-round {
  display: inline-block;
  transform: translateY(1px);
}

article {
  padding: 15px;
  border-top: 1px dotted #ddd;

  header + & {
    border-top: 1px solid #eee;
    margin-top: 20px;
  }

  &:last-child {
    border-bottom: 1px solid #eee;
  }

  &.reply {
    border-top: none;
    background: #f7f7f7;
    margin-top: 10px;
    margin-bottom: 30px;
    border-radius: 0 5px 5px 5px;
    position: relative;
  }

  .replyIcon {
    display: block;
    position: absolute;
    left: 0;
    top: -20px;
    width: 20px;
    height: 20px;
    background: #f7f7f7;
    overflow: hidden;

    &::before {
      content: "";
      display: block;
      width: 40px;
      height: 40px;
      border-radius: 40px;
      margin-top: -20px;
      background: #fff;
    }

  }
}

figure {
  @include img-wrap();
  width: 30px;
  height: 30px;
  border-radius: 30px;
  overflow: hidden;
}

.comment {

  &WriterID {
    font-size: 15px;
    margin-left: 5px;
  }

  &CreatedAt {
    font-size: 13px;
    color: #aaa;
    margin-left: 10px;
  }

  &Edit {
    margin-left: auto
  }

  &Content {
    margin-top: 10px;
    line-height: 1.5;
    min-height: calc(15px * (1.5 * 2));
    letter-spacing: -0.5px;
  }

}

.noComment {
  text-align: center;
  background: #fafafa;
  padding: 30px;
  color: #aaa;
  border-radius: 5px;
  border: 1px solid #eee;
}


</style>