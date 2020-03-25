<template>
  <div v-if="post !== null">

    <main class="contentContainer">

      <markdown :content="post.content" :title="post.title" :is-sidebar="true" />

    </main>

    <div class="contentContainer">

      <comment-list />

      <comment-form />

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { FETCH_POST } from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { Post as PostType } from '@Domain'
import { Markdown, CommentList, CommentForm } from '@/components'

const components = { Markdown, CommentList, CommentForm }

@Component({ components })
export default class Post extends Vue {
  @Action(FETCH_POST) fetchPost!: ActionMethod
  @State(state => state.post.selectedPost) post!: PostType|null

  created () {
    this.fetchPost(this.$route.params.idx)
  }
}
</script>

<style lang="scss">
.contentContainer {
  width: 800px;
  padding: 30px;
  margin: 0 auto 30px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 0 1px fade-out(#ddd, 0.5);

}
</style>