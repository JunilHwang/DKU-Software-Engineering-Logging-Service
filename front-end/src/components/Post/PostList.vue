<template>
  <section class="postWrapper">
    <article v-for="(v, k) in postList" :key="k">
      <h2>{{ v.title }}</h2>
      <p>{{ v.createdAt }}</p>
      <p>
        <figure>
          <img :src="v.writer.profile.avatar_url" :alt="v.writer.id">
        </figure>
        {{ v.writer.id }}
      </p>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { ActionMethod } from 'vuex'
import { Post } from '@Domain'
import { FETCH_POST_ALL } from '@/middleware/store/types'
import { eventBus } from '@/helper'

@Component
export default class PostList extends Vue {
  @State(state => state.post.postList) postList!: Post[]
  @Action(FETCH_POST_ALL) fetchAll!: ActionMethod

  created () {
    this.fetchAll()

    eventBus.$on('fetchPostAll', this.fetchAll)

  }
}
</script>