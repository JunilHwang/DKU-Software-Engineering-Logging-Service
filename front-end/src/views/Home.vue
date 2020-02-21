<template>
  <main id="home">
    <ul>
      <li v-for="({ name, full_name }, k) in list" :key="k">
        <a :href="`${baseURL}/${full_name}`" v-html="name" target="_blank" />
      </li>
    </ul>
  </main>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { githubService } from '../services';

@Component
export default class Home extends Vue {
  list = []
  baseURL = 'https://github.com'
  async created () {
    this.list = await githubService.getRepo('junilhwang')
  }
}
</script>