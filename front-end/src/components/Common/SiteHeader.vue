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
          <li>
            <router-link to="/mypage" class="siteHeaderProfile">
              <figure class="img-wrap">
                <img :src="profile.avatar_url" :alt="profile.login" />
              </figure>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { State } from 'vuex-class'

@Component
export default class SiteHeader extends Vue {
  @State(state => state.user.profile) profile: any

  created () {
    console.log(this.profile)
  }

  signIn () {
    location.replace('/api/github/sign-in')
  }
}
</script>