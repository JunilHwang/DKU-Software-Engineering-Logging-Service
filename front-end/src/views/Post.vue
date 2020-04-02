<template>
  <div v-if="post !== null">

    <main class="contentContainer">

      <post-header :post="post" />

      <markdown :content="post.content" :title="post.title" :is-sidebar="true" />

      <div class="iconGroup">
        <a href="#" class="iconWrap like">
          <fa icon="heart" />
        </a>
        <a href="#" class="iconWrap share">
          <fa icon="share-alt" />
        </a>
        <a href="#" class="iconWrap back" @click="$router.back()">
          <fa icon="reply" />
        </a>
        <a v-if="isWriter" href="#" class="iconWrap edit">
          <i class="el-icon-edit-outline" />
        </a>
        <a v-if="isWriter" href="#" class="iconWrap delete">
          <i class="el-icon-delete" />
        </a>
      </div>

    </main>

    <div class="contentContainer">

      <comment-list :fetch-comment="fetchComment" />

      <comment-form v-if="isUser" :fetch-comment="fetchComment" />

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import {FETCH_COMMENT, FETCH_POST} from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { Post as PostType } from '@Domain'
import { Markdown, CommentList, CommentForm, PostHeader } from '@/components'
import { GithubProfile } from '@Domain'

const components = { Markdown, CommentList, CommentForm, PostHeader }

@Component({ components })
export default class Post extends Vue {
  @Action(FETCH_POST) fetchPostAction!: ActionMethod
  @Action(FETCH_COMMENT) fetchCommentAction!: ActionMethod
  @State(state => state.post.selectedPost) post!: PostType|null
  @State(state => state.user.profile) profile!: GithubProfile|null

  private get isWriter () {
    return this.profile && this.post && this.profile.login === this.post.writer.id
  }

  private get isUser () {
    return this.profile !== null
  }

  private async fetchPost () {
    try {
      await this.fetchPostAction(this.$route.params.idx)
      console.log(this.$route.params.idx)
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 포스트를 가져올 수 없습니다.' })
    }
  }

  private async fetchComment () {
    try {
      await this.fetchCommentAction(this.$route.params.idx)
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 포스트를 가져올 수 없습니다.' })
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