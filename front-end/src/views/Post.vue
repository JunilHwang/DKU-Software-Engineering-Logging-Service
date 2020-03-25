<template>
  <main v-if="post !== null">
    <div class="postContainer">
      <markdown :content="post.content" :title="post.title" :is-sidebar="true" />
    </div>
    <comment-list />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { FETCH_POST } from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { Post as PostType } from '@Domain'
import { Markdown, CommentList } from '@/components'

const components = { Markdown, CommentList }

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
  .postContainer {
    width: 800px;
    padding: 30px;
    margin: 0 auto;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 0 1px fade-out(#ddd, 0.5);
  }
</style>