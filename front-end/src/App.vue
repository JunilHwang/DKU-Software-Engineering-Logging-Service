<template>
  <div id="app">
    <site-header></site-header>
    <router-view/>
    <site-footer></site-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { default as components } from '@/components/Common';

@Component({ components })
export default class App extends Vue { }
</script>

<style lang="scss" src="@/assets/scss/common.scss"></style>
