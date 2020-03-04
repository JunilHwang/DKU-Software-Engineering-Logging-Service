<template>
  <header class="siteHeader">
    <div class="container">
      <div class="siteHeaderLogo">
        <router-link to="/">DKU Developer Logging</router-link>
      </div>
      <nav class="gnb">
        <ul v-if="profile.login.length === 0">
          <li>
            <el-button type="default" size="small" @click="signIn" round>
              Login With <strong>GitHub</strong>
            </el-button>
          </li>
        </ul>
        <ul v-else>
          <li>
            <el-button icon="el-icon-edit-outline" type="default" size="mini" plain circle />
          </li>
          <li>
            <el-link class="siteHeaderProfile">
              <figure class="img-wrap">
                <img :src="profile.avatar_url" :alt="profile.login" />
              </figure>
            </el-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { GithubProfile } from '@Domain/Github';

@Component
export default class SiteHeader extends Vue {
  @State(state => state.user.profile) profile!: GithubProfile

  signIn () {
    location.replace('/api/github/sign-in')
  }
}
</script>
