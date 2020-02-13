<template>
  <main id="home">
    <ul>
      <li v-for="(v, k) in list" :key="k">
        <a href="#" v-html="v" />
      </li>
    </ul>
  </main>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import $http from 'axios'

@Component
export default class Home extends Vue {
  list = []
}
</script>