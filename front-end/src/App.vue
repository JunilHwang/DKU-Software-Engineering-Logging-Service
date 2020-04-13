<template>
  <div id="app">
    <site-header />
    <github-factory />
    <div class="siteContent">
      <router-view />
    </div>
    <site-footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { GithubFactory, SiteHeader, SiteFooter } from '@/components'
import { AccessToken } from '@/middleware/store/types'
import { ActionMethod } from 'vuex'

const components = { GithubFactory, SiteHeader, SiteFooter }
const userStore = namespace('user')

@Component({ components })
export default class App extends Vue {
  @userStore.State private access_token!: AccessToken
  @userStore.Action private SIGN_IN!: ActionMethod

  async created () {
    const { access_token, SIGN_IN } = this
    access_token
    && SIGN_IN
    && await SIGN_IN(access_token)
  }
}
</script>

<style lang="scss" src="@/assets/scss/common.scss"></style>
