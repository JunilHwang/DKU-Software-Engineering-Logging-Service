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
import { namespace } from 'vuex-class'
import { Post} from 'domain/src'
import { ActionMethod } from 'vuex'
import { eventBus } from '@/helper'

const components = { PostList }
const postStore = namespace('post')

@Component({ components })
export default class Home extends Vue {

  @postStore.State private postList!: Post[]
  @postStore.Action private FETCH_POST_ALL!: ActionMethod

  async created () {
    await this.FETCH_POST_ALL()
    eventBus.$on('fetchPostAll', this.FETCH_POST_ALL)

  }
}
</script>