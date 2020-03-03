<template>
  <main id="repository">
    <div class="container">
      <github-repository />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { GithubRepository } from '@/components/Github'

const components = { GithubRepository }

@Component({ components })
export default class Mypage extends Vue {

}
</script>