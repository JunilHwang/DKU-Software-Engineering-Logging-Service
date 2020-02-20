<template>
  <header class="siteHeader">
    <div class="container">
      <div class="siteHeaderLogo">
        <router-link to="/">DKU Developer Logging</router-link>
      </div>
      <nav class="gnb">
        <ul>
          <li><router-link to="/">Repositories</router-link></li>
          <li><router-link to="/content">Content</router-link></li>
          <li>
            <el-button type="default" size="small" round="true" @click="signIn">
              Login With <strong>GitHub</strong>
            </el-button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class SiteHeader extends Vue {
  signIn () {
    location.replace('/api/github/sign-in')
  }
}
</script>