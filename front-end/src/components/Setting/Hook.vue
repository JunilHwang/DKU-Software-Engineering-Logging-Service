  <template>
  <section class="settingContent">
    <h2 class="settingContentTitle">
      <span>자동 반영 저장소 관리</span>
      <article v-for="v in hookList" :key="idx">
        {{ v.repo }}
      </article>
      <p v-if="hookList.length === 0" class="none">
        등록된 자동 반영 저장소가 없습니다.
      </p>
    </h2>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { State, Action } from 'vuex-class'
import { GithubHook } from '@Domain'
import { FETCH_GITHUB_HOOK } from '@/middleware/store/types'

@Component
export default class Hook extends Vue {
  @State(state => state.github.hookList) hookList!: GithubHook[]
  @Action(FETCH_GITHUB_HOOK) fetchHook!: ActionMethod

  created () {
    this.fetchHook()
  }
}
</script>