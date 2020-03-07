<template>
  <main id="home">
    <div class="container">
      <post-list :data="postList" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PostList } from '@/components'
import { Action, State} from 'vuex-class'
import { Post} from '@Domain'
import { FETCH_POST_ALL} from '@/middleware/store/types'
import { ActionMethod} from 'vuex'
import { eventBus} from '@/helper'

const components = { PostList }

@Component({ components })
export default class Home extends Vue {

  @State(state => state.post.postList) postList!: Post[]
  @Action(FETCH_POST_ALL) fetchAll!: ActionMethod

  created () {
    this.fetchAll()

    eventBus.$on('fetchPostAll', this.fetchAll)

  }
}
</script>