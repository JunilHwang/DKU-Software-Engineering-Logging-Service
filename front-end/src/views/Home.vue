<template>
  <main id="home">
    <div class="container">
      <post-list />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PostList } from '@/components'

const components = { PostList }

@Component({ components })
export default class Home extends Vue {
}
</script>