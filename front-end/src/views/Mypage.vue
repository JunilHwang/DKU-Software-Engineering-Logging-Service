<template>
  <main id="mypage">
    <div class="container">
      <post-list />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PostList } from '@/components'

const components = { PostList }

@Component({ components })
export default class Mypage extends Vue {

}
</script>