<template>
  <div v-if="post !== null">

    <main class="contentContainer">

      <post-header :post="post" @delete="deletePost" />

      <markdown :content="post.content" :title="post.title" :is-sidebar="true" />

      <div class="iconGroup">
        <a @click.prevent="toggleLike"
           href="#"
           class="iconWrap like"
           :class="{ active: likeActive }"
        >
          <fa icon="heart" />
          <strong>
            {{ post.likeUsers.length }}
          </strong>
        </a>
        <a href="#" class="iconWrap share">
          <fa icon="share-alt" />
        </a>
        <a @click.prevent="$router.back()" href="#" class="iconWrap back">
          <fa icon="reply" />
        </a>
        <template v-if="isWriter">
          <a @click.prevent href="#" class="iconWrap edit">
            <i class="el-icon-edit-outline" />
          </a>
          <a @click.prevent="deletePost" href="#" class="iconWrap delete">
            <i class="el-icon-delete" />
          </a>
        </template>
      </div>

    </main>

    <div class="contentContainer">

      <comment-list @open-form="openForm" />

      <comment-form v-if="isUser" />

      <comment-dialog ref="commentDialog" />

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { FETCH_COMMENT, FETCH_POST, LIKE_POST, DELETE_POST } from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { Post as PostType } from '@Domain'
import { Markdown, CommentList, CommentForm, CommentDialog, PostHeader } from '@/components'
import { GithubProfile } from '@Domain'

const components = { Markdown, CommentList, CommentForm, CommentDialog, PostHeader }

@Component({ components })
export default class Post extends Vue {
  @Action(FETCH_POST) fetchPostAction!: ActionMethod
  @Action(FETCH_COMMENT) fetchCommentAction!: ActionMethod
  @Action(LIKE_POST) likePost!: ActionMethod
  @Action(DELETE_POST) deletePostAction!: ActionMethod
  @State(state => state.post.selectedPost) post!: PostType|null
  @State(state => state.user.profile) profile!: GithubProfile|null

  private get isWriter () {
    return this.profile && this.post && this.profile.login === this.post.writer.id
  }

  private get isUser () {
    return this.profile !== null
  }

  private get likeActive () {
    return this.isUser && this.post !== null && this.post.likeUsers.find(({ id }) => id === this.profile!.login)
  }

  private async fetchPost () {
    try {
      await this.fetchPostAction(this.$route.params.idx)
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 포스트를 가져올 수 없습니다.' })
    }
  }

  private async deletePost () {
    const confirmButtonText = '확인',
          cancelButtonText = '취소',
          type = 'warning',
          msg = '정말로 삭제하시겠습니까?',
          title = '포스트 삭제'

    this.$confirm(msg, title, { type, confirmButtonText, cancelButtonText })
        .then(async () => {
          try {
            await this.deletePostAction(this.$route.params.idx)
            this.$message({ type: 'success', message: '포스트가 삭제되었습니다.' })
            await this.$router.push('/')
          } catch (e) {
            const message: string =  e === 401 ? '포스트 삭제 권한이 없습니다.' : '오류로 인하여 포스트를 삭제할 수 없습니다'
            this.$message({ type: 'error', message })
          }
        })
        .catch(() => {
          this.$message({ type: 'info', message: '포스트 삭제가 취소되었습니다.' })
        })
  }

  private async fetchComment () {
    try {
      await this.fetchCommentAction(this.$route.params.idx)
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 포스트를 가져올 수 없습니다.' })
    }
  }

  private openForm (params: { idx: number, type: 'reply'|'update' }) {
    const target: any = this.$refs.commentDialog
    target.open(params)
  }

  private async toggleLike () {
    try {
      await this.likePost(this.$route.params.idx)
    } catch (e) {
      let message: string =  '오류로 인하여 좋아요를 완료할 수 없습니다.'
      if (e === 401) message = '로그인 후 이용해주세요'
      this.$message({ type: 'error', message })
    }
  }

  private created () {
    this.fetchPost()
    this.fetchComment()
  }
}
</script>

<style lang="scss" scoped>
.contentContainer {
  width: 800px;
  padding: 30px;
  margin: 0 auto 30px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 0 1px fade-out(#ddd, 0.5);
}

.icon {

  &Group {
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }

  &Wrap {
    display: inline-flex;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    line-height: 50px;
    font-size: 19px;
    border: 1px solid #000;
    color: #000;
    opacity: 0.3;
    justify-content: center;
    align-items: center;
    margin: 0 5px;

    &.like {
      padding: 0 5px;

      &.active {
        background: #000;
        color: #fff;
      }

      strong {
        margin-left: 5px;
      }
    }

    &:hover {
      opacity: 1;

      &.delete {
        $color: #ff3860;
        color: $color;
        border-color: $color;
      }

      &.edit {
        $color: #85CE61;
        color: $color;
        border-color: $color;
      }

    }
  }

}
</style>