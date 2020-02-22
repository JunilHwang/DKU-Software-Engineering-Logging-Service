<template>
  <div id="app">
    <site-header />
    <div class="siteContent">
      <router-view />
    </div>
    <site-footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Action, State } from 'vuex-class'
import { default as components } from '@/components/Common';
import { SIGN_IN } from '@/middleware/store/MutationType';
import {ActionMethod} from "vuex";
import {AccessToken} from "@/middleware/store/StateType";

@Component({ components })
export default class App extends Vue {
  @State(state => state.user.access_token)
  private token: AccessToken | undefined

  @Action(SIGN_IN) signIn: ActionMethod | undefined

  created () {
    const { token, signIn } = this
    token && signIn && signIn(token)
  }
}
</script>

<style lang="scss" src="@/assets/scss/common.scss"></style>
