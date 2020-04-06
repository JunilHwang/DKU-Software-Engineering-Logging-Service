<template>
  <main class="container">
    <h1>
      <i class="el-icon-setting" /> 설정
    </h1>
    <div class="main">
      <nav>
        <ul>
          <li v-for="({ title, path }, k) in tab" :key="k">
            <router-link :to="path" v-html="title" />
          </li>
        </ul>
      </nav>
      <router-view />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { AccessToken } from '@/middleware/store/types'

interface TabMenu {
  title: string
  path: string
}

@Component
export default class Setting extends Vue {
  @State(state => state.user.access_token) access_token!: AccessToken

  @Watch('access_token') onAccessToken () {
    this.accessCheck()
  }

  private tab: TabMenu[] = [
    { title: 'Hook', path: '/setting/hook' },
    { title: 'Profile', path: '/setting/profile' },
  ]

  accessCheck () {
    if (this.access_token === null) {
      this.$message({ type: 'warning', message: '비회원은 접근할 수 없습니다' })
      this.$router.push('/')
    }
  }

  created () {
    this.accessCheck()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/lib';

ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.main {
  background: #fff;
  border-radius: 3px;
  border: 1px solid #ddd;
  padding: 20px;
}

h1 {
  font-weight: normal;
  font-size: 23px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
  margin:0 0 15px;
  position: relative;
  letter-spacing: -1px;

  i {
    transform: translateY(1px);
  }

  &:before {
    content: "";
    position: absolute;
    display: block;
    left: 0;
    bottom: -2px;
    width: 150px;
    height: 3px;
    background: #09F;
  }
}

nav {
  margin: -20px -20px 0;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;

  ul {
    display: flex;
  }

  a {
    display: block;
  }
}
</style>