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
import { Action, State } from 'vuex-class'
import { default as components } from '@/components/Common';
import { SIGN_IN } from '@/middleware/store/mutations-type';

@Component({ components })
export default class App extends Vue {
  @State(state => state.user.access_token) token
  @Action(SIGN_IN) signIn

  created () {
    const { token, signIn } = this
    token && signIn(token)
  }
}
</script>

<style lang="scss" src="@/assets/scss/common.scss"></style>
