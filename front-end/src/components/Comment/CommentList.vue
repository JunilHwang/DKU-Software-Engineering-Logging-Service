<template>
  <section>
    <article v-for="{ idx, content, writer: { id, profile }, createdAt } in commentList" :key="idx">
      <ul>
        <li class="commentWriter">
          <figure>
            <img :src="profile.avatar_url" :alt="id">
          </figure>
          <span class="commentWriterID" v-html="id" />
        </li>
        <li class="commentCreatedAt">{{ createdAt*1 | dateformat }}</li>
      </ul>
      <div class="commentContent" v-html="content" />
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { Action, State } from 'vuex-class'
import { FETCH_COMMENT } from '@/middleware/store/types'
import { Comment } from '@Domain'

@Component
export default class CommentList extends Vue {

  @Action(FETCH_COMMENT) fetchComment!: ActionMethod
  @State(state => state.comment.commentList) commentList!: Comment[]

  created () {
    this.fetchComment(this.$route.params.idx)
  }

}
</script>

<style lang="scss" scoped>
section {
  padding: 70px 0;
}
</style>