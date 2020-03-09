<template>
  <main class="postContainer" v-if="post !== null">
    <markdown :content="post.content" :is-sidebar="true" />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { FETCH_POST } from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { Post as PostType } from '@Domain'
import { Markdown } from '@/components'

const components = { Markdown }

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
    margin: 0 auto
  }
</style>