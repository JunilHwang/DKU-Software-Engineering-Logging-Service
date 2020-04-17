<template>
  <div v-if="selectedPost !== null">

    <main class="contentContainer">

      <post-header
        :post="selectedPost"
        @refresh="refreshPost"
        @edit="editPost"
        @delete="deletePost"
      />

      <markdown :content="selectedPost.content" :title="selectedPost.title" :is-sidebar="true" />

      <div class="iconGroup">
        <el-tooltip content="좋아요" placement="bottom">
          <a @click.prevent="toggleLike"
             href="#"
             class="iconWrap like"
             :class="{ active: likeActive }">
            <fa icon="heart" />
            <strong v-html="selectedPost.likeUsers.length" />
          </a>
        </el-tooltip>
        <el-tooltip content="공유하기" placement="bottom">
          <a href="#" class="iconWrap share">
              <fa icon="share-alt" />
          </a>
        </el-tooltip>
        <a @click.prevent="$router.back()" href="#" class="iconWrap back">
          <fa icon="reply" />
        </a>
        <template v-if="isWriter">
          <a slot="reference" @click.prevent="editPost" href="#" class="iconWrap edit">
            <i class="el-icon-edit-outline" />
          </a>
          <el-popconfirm
            @onConfirm="refreshPost"
            title="포스트를 업데이트 하시겠습니까?"
            confirm-button-text="확인"
            cancel-button-text="취소">
            <a slot="reference" @click.prevent href="#" class="iconWrap refresh">
              <i class="el-icon-refresh" />
            </a>
          </el-popconfirm>
          <el-popconfirm
            @onConfirm="deletePost"
            title="정말로 삭제하시겠습니까?"
            confirm-button-text="확인"
            cancel-button-text="취소">
            <a slot="reference" href="#" class="iconWrap delete" @click.prevent>
              <i class="el-icon-delete" />
            </a>
          </el-popconfirm>
        </template>
      </div>

    </main>

    <section class="contentContainer original">
      <h3>
        <i class="el-icon-tickets" />
        원본 문서
      </h3>
      <p>
        <a :href="originalRepository" target="_blank" class="point fromLeft" v-html="selectedPost.route" />
      </p>
    </section>

    <div class="contentContainer">

      <comment-list @open-form="openForm" />

      <comment-form v-if="isUser" />

      <comment-dialog ref="commentDialog" />

    </div>

    <template v-if="isWriter">
      <post-edit
        ref="postEditor"
        @open-link-editor="() => $refs.linkEditor.open()"
        @update-route="updateRoute" />
      <github-link-editor
        ref="linkEditor"
        @show-content="args => $refs.contentEditor.open(...args)" />
      <github-content
        ref="contentEditor"
        @save-editing="args => $refs.postEditor.updateRoute(args)" />
    </template>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { ActionMethod } from 'vuex'
import { Post as PostType, GithubProfile } from 'domain/src'
import { Markdown, CommentList, CommentForm, CommentDialog, PostHeader, PostEdit, GithubLinkEditor, GithubContent } from '@/components'

const components = { Markdown, CommentList, CommentForm, CommentDialog, PostHeader, PostEdit, GithubLinkEditor, GithubContent }

interface DialogComponent extends Vue {
  open: Function
  close: Function
}

const postStore = namespace('post')
const commentStore = namespace('comment')
const userStore = namespace('user')

@Component({ components })
export default class Post extends Vue {
  @postStore.Action private FETCH_POST!: ActionMethod
  @postStore.Action private LIKE_POST!: ActionMethod
  @postStore.Action private DELETE_POST!: ActionMethod
  @postStore.Action private REFRESH_POST!: ActionMethod
  @commentStore.Action private FETCH_COMMENT!: ActionMethod
  @postStore.State private selectedPost!: PostType|null
  @userStore.State private profile!: GithubProfile|null

  private get originalRepository () {
    if (this.selectedPost === null) return ''
    const route = this.selectedPost.route.split('/')
    const head: string = route.slice(0, 2).join('/')
    const tail: string = route.slice(2).join('/')
    return `https://github.com/${head}/blob/master/${tail}`
  }

  private get isWriter (): Boolean {
    return !!this.profile && !!this.selectedPost && this.profile.login === this.selectedPost.writer.id
  }

  private get isUser (): Boolean {
    return this.profile !== null
  }

  private get likeActive (): Boolean {
    return this.isUser && this.selectedPost !== null && !!this.selectedPost.likeUsers.find(({ id }) => id === this.profile!.login)
  }

  private async fetchPost () {
    await this.FETCH_POST(this.$route.params.idx)
  }

  private async deletePost () {
    await this.DELETE_POST(this.$route.params.idx)
    this.$message({ type: 'success', message: '포스트가 삭제되었습니다.' })
    await this.$router.push('/')
  }

  private async editPost () {
    (this.$refs.postEditor as DialogComponent).open({ ...this.selectedPost })
  }

  private async refreshPost () {
    await this.REFRESH_POST({ ...this.selectedPost })
    this.$message({ type: 'success', message: '포스트가 업데이트 되었습니다.' })
  }

  private async fetchComment () {
    await this.FETCH_COMMENT(this.$route.params.idx)
  }

  private openForm (params: { idx: number, type: 'reply'|'update' }) {
    const target: any = this.$refs.commentDialog
    target.open(params)
  }

  private async toggleLike () {
    await this.LIKE_POST(this.$route.params.idx)
  }

  private async updateRoute () {
    const linkEditor = this.$refs.linkEditor as DialogComponent
    const contentEditor = this.$refs.contentEditor as DialogComponent
    linkEditor.close()
    contentEditor.close()
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
  margin: 0 auto 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 0 1px fade-out(#ddd, 0.5);
}

.original {

  h3 {
    font-weight: normal;
    font-size: 20px;
    margin: 0;

    i {
      transform: translateY(1px);
    }
  }

  p {
    color: #666;
    margin: 15px 0 0;
    font-family: enFont();
  }

  a {
    padding-bottom: 3px;
  }
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

      &.refresh {
        $color: #06F;
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