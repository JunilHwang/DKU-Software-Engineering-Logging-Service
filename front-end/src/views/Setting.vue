<template>
  <main class="container">
    테스트
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { AccessToken } from '@/middleware/store/types'

@Component
export default class Setting extends Vue {
  @State(state => state.user.access_token) access_token!: AccessToken

  @Watch('access_token') onAccessToken () {
    this.accessCheck()
  }

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