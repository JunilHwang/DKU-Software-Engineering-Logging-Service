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

  async created () {
    try {
      await this.fetchAll()
    } catch (e) {
      this.$message({ type: 'error', message: '오류로 인하여 포스트 목록을 가져올 수 없습니다.' })
    }

    eventBus.$on('fetchPostAll', this.fetchAll)

  }
}
</script>