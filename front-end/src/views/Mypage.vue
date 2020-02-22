<template>
  <main id="repository">
    <div class="container">
      <github-repository />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { GithubRepository } from '@/components/Github';

const components = { GithubRepository }

@Component({ components })
export default class Mypage extends Vue {

}
</script>