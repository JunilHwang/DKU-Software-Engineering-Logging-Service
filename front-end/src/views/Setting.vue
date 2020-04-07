<template>
  <main class="container">
    <h1>
      <i class="el-icon-setting" /> 설정
    </h1>
    <el-tabs type="border-card">
      <el-tab-pane v-for="({ title, component }, k) in tab" :key="k" :label="title">
        <component :is="component" />
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { AccessToken } from '@/middleware/store/types'
import { Hook, Profile } from '@/components'

interface TabMenu {
  title: string
  component: string
}

const components = { Hook, Profile }

@Component({ components })
export default class Setting extends Vue {
  @State(state => state.user.access_token) access_token!: AccessToken

  @Watch('access_token') onAccessToken () {
    this.accessCheck()
  }

  private tab: TabMenu[] = [
    { title: 'Hook', component: 'Hook' },
    { title: 'Profile', component: 'Profile' },
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
@import '../assets/scss/lib';

ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
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
</style>

<style lang="scss">
.settingContent {
  margin: -15px;
  padding: 30px;

  &Title {
    margin: 0 0 20px;
    letter-spacing: -1px;
    font-size: 21px;
    font-weight: 400;

    span {
      display: inline-block;
      margin-left: 5px;
    }
  }
}
</style>