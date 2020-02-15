<template>
  <main id="content">
    this is {{ content }}
  </main>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { githubService } from '../services';

@Component
export default class Content extends Vue {
  content = null
  baseURL = 'https://github.com'
  async created () {
    this.content = await githubService.getContent({user: 'junilhwang', repo: 'TIL', path: 'README.md'})
    console.log(this.content)
  }
}
</script>