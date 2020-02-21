<template>
  <div id="app">
    <site-header></site-header>
    <div class="siteContent">
      <router-view />
    </div>
    <site-footer></site-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Action } from 'vuex-class'
import { default as components } from '@/components/Common';
import { SIGN_IN } from '@/middleware/store/mutations-type';

@Component({ components })
export default class App extends Vue {

  @Action(SIGN_IN) signIn

  created () {
    this.signIn()
  }
}
</script>

<style lang="scss" src="@/assets/scss/common.scss"></style>
