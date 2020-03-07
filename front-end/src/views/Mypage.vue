<template>
  <main id="mypage">
    <div class="container">
      <post-list :data="postList" />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PostList } from '@/components'
import { Action, State } from 'vuex-class'
import { Post,  GithubProfile } from '@Domain'
import { FETCH_USER_POST } from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { eventBus } from '@/helper'

const components = { PostList }

@Component({ components })
export default class Mypage extends Vue {

  @State(state => state.user.posts) postList!: Post[]
  @Action(FETCH_USER_POST) fetchUserPost!: ActionMethod

  created () {
    this.fetchUserPost()

    eventBus.$on('fetchPostAll', this.fetchUserPost)

  }

}
</script>