<template>
  <header class="siteHeader">
    <div class="container">
      <div class="siteHeaderLogo">
        <router-link to="/">DKU Developer Logging</router-link>
      </div>
      <nav class="gnb">
        <ul v-if="profile.login === undefined">
          <li>
            <el-button type="default" size="small" @click="signIn" round>
              Login With <strong>GitHub</strong>
            </el-button>
          </li>
        </ul>
        <ul v-else>
          <li><router-link to="/repository">Repository</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { State } from 'vuex-class'

@Component
export default class SiteHeader extends Vue {
  @State(state => state.user.profile) profile

  created () {
    console.log(this.profile)
  }

  signIn () {
    location.replace('/api/github/sign-in')
  }
}
</script>