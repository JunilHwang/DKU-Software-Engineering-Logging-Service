<template>
  <nav class="gnb">
    <ul v-if="!profile">
      <li>
        <el-button type="default" size="small" @click="signIn" round>
          Login With <strong>GitHub</strong>
        </el-button>
      </li>
    </ul>
    <ul v-else>
      <li>
        <el-button @click="openLinkEditor" icon="el-icon-link" type="default" size="mini" plain circle />
      </li>
      <li>
        <el-button @click="repositoryListOpen" icon="el-icon-edit-outline" type="default" size="mini" plain circle />
      </li>
      <li>
        <a href="#" class="siteHeaderProfile" @click.prevent.stop="menuToggle">
          <figure class="img-wrap">
            <img :src="profile.avatar_url" :alt="profile.login" />
          </figure>
        </a>
        <ul ref="submenu">
          <li><a href="#" @click.stop.prevent="logout"><i class="el-icon-close" /> 로그아웃</a></li>
          <li><router-link :to="`/user/${profile.login}`"><i class="el-icon-user-solid" /> 마이페이지</router-link></li>
          <li><router-link to="/setting"><i class="el-icon-setting" /> 설정</router-link></li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { Profile } from '@Domain'
import { SIGN_OUT } from '@/middleware/store/types'
import { eventBus } from '@/helper'

@Component
export default class SiteHeader extends Vue {
  @State(state => state.user.profile) profile!: Profile|null

  signIn () {
    location.replace('/api/github/sign-in')
  }

  menuToggle () {
    const target: HTMLElement = this.$refs.submenu as HTMLElement
    const isActive = target.classList.contains('active')
    target.classList[isActive ? 'remove' : 'add']('active')
  }

  logout () {
    this.$message({ type: 'info', message: '로그아웃 되었습니다'})
    this.$store.commit(SIGN_OUT)
    const target: HTMLElement = this.$refs.submenu as HTMLElement
    target.classList.remove('active')
  }

  repositoryListOpen () {
    eventBus.$emit('repositoryListOpen')
  }

  openLinkEditor () {
    eventBus.$emit('openLinkEditor')
  }

  created () {
    document.body.onclick = () => {
      const target: HTMLElement = this.$refs.submenu as HTMLElement
      if (target && target.classList.contains('active')) {
        target.classList.remove('active');
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/lib";

.gnb {
  float: right;

  * {
    padding: 0;
    margin: 0;
  }

  ul, li {
    list-style: none;
  }

  > ul {
    @include clear-fix();

    > li {
      float: left;
      margin-left: 15px;
      position: relative;

      a {
        display: block;
        font-weight: 600;
        color: #333;
        position: relative;
      }

      > a {

        &:hover {
          text-decoration: none;
        }

        &.router-link-exact-active {
          color: #09F;
        }

        &:not(.siteHeaderProfile):after {
          content: "";
          position: absolute;
          display: block;
          height: 2px;
          background: #09F;
          left: 50%;
          right: 50%;
          bottom: 15px;
          transition-property: left, right;
          transition-duration: 0.3s;

          .router-link-exact-active & {
            left: 0;
            right: 0;
          }
        }
      }
      > ul {
        &.active {
          display: block;
        }
        display: none;
        position: absolute;
        right: 0;
        width: 130px;
        background: #fff;
        box-shadow: 0 0 5px #ccc;
        z-index: 10;
        line-height: 3;
        font-size: 13px;

        a {
          padding:0 10px;
          &:hover {
            background: #f5f5f5;
            transition: background-color 0.3s;
          }
        }
      }
    }
  }
}
</style>