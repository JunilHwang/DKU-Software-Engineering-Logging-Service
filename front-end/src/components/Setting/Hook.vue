  <template>
  <section class="settingContent">
    <h2 class="settingContentTitle">
      <i class="el-icon-document-copy" />
      <span>자동 반영 저장소 관리</span>
    </h2>
    <ul class="description">
      <li>Github Hook을 이용하여 commit 발생 시 <strong>등록된 포스트와 동기화</strong>합니다.</li>
      <li>포스트로 등록한 파일의 위치나 이름이 달라질 경우, <strong>수동으로 동기화</strong>를 해야합니다.</li>
      <li>저장소의 ID를 클릭하면 <strong>Ping Test</strong>를 할 수 있습니다.</li>
    </ul>
    <el-table
      v-if="hookList.length"
      :data="hookList"
      class="table"
      :stripe="true"
      :header-row-class-name="() => 'tableHeader'"
    >
      <el-table-column label="ID" width="150" align="center">
        <template slot-scope="scope">
          <a href="#" @click.prevent="pingTest(scope.row)" v-html="scope.row.data.id" />
        </template>
      </el-table-column>
      <el-table-column label="저장소" align="center">
        <template slot-scope="scope">
          <a :href="`https://github.com/${scope.row.repo}`" target="_blank">
            <i class="el-icon-news" />
            {{ scope.row.repo }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="등록일" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.data.created_at | dateformat }}
        </template>
      </el-table-column>
      <el-table-column label="관리" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit-outline" size="mini" plain circle />
          <el-button @click="remove(scope.row.idx)" type="danger" icon="el-icon-delete" size="mini" plain circle />
        </template>
      </el-table-column>
    </el-table>
    <p v-if="hookList.length === 0" class="none">
      등록된 자동 반영 저장소가 없습니다.
    </p>
    <div class="btnGroup right">
      <el-button @click="() => repositories.open()" type="primary" size="small" icon="el-icon-circle-plus-outline" plain>저장소 등록</el-button>
    </div>
    <github-repository-list ref="repositories" @select="add" />
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { State, Action } from 'vuex-class'
import { GithubHook, GithubRepository } from '@Domain'
import { AccessToken, ADD_GITHUB_HOOK, DELETE_GITHUB_HOOK, FETCH_GITHUB_HOOK } from '@/middleware/store/types'
import { githubClientService } from '@/services'
import { GithubRepositoryList } from '@/components'

const components = { GithubRepositoryList }

@Component({ components })
export default class Hook extends Vue {
  @State(state => state.github.hookList) hookList!: GithubHook[]
  @State(state => state.user.access_token) access_token!: AccessToken
  @Action(FETCH_GITHUB_HOOK) fetchHook!: ActionMethod
  @Action(DELETE_GITHUB_HOOK) deleteHook!: ActionMethod
  @Action(ADD_GITHUB_HOOK) addHook!: ActionMethod

  private get repositories (): any {
    return this.$refs.repositories
  }

  private async pingTest ({ repo, data: { id } }: GithubHook) {
    if (this.access_token === null) {
      this.$message({ type: 'error', message: '다시 로그인 해주세요' })
      return
    }
    try {
      await githubClientService.hookPingTest(repo, id, this.access_token)
      this.$message({ type: 'success', message: '핑 테스트를 성공했습니다.' })
    } catch (e) {
      this.$message({ type: 'error', message: '핑 테스트 도중 오류가 발생했습니다.' })
    }
  }

  private async remove (idx: number) {
    const confirmMsg: string = '정말로 삭제하시겠습니까?'
    const confirmTitle: string = 'Hook 삭제'
    const confirmButtonText: string = '확인'
    const cancelButtonText: string = '취소'
    const type: 'warning' = 'warning'

    this
      .$confirm(confirmMsg, confirmTitle, { type, confirmButtonText, cancelButtonText })
      .then(async () => {
        try {
          await this.deleteHook(idx)
          this.$message({ type: 'success', message: '삭제되었습니다.' })
        } catch (e) {
          const message: string = e === 401 ? '다시 로그인 해주세요' : '오류로 인하여 삭제가 취소되었습니다.';
          this.$message({ type: 'error', message })
        }
      })
      .catch(() => {
        this.$message({ type: 'info', message: '취소되었습니다.' })
      })
  }

  private async add (repo: GithubRepository) {
    try {
      await this.addHook(repo.full_name)
      this.$message({ type: 'success', message: '추가 되었습니다.' })
      this.repositories.close()
    } catch (e) {
      const message: string = e === 401 ? '다시 로그인 해주세요' : '오류로 인하여 취소되었습니다.';
      this.$message({ type: 'error', message })
    }
  }

  private async created () {
    try {
      await this.fetchHook()
    } catch (e) {
      const message: string = e === 401 ? '다시 로그인 해주세요' : '오류로 인하여 목록을 가져올 수 없습니다.';
      this.$message({ type: 'error', message })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/lib";
li {
  font-size: 13px;
  line-height: 1.6;
  color: #666;
}

.table {
  font-font: enFont();
  font-size: 13px;

  i {
    display: inline-block;
    transform: translateY(1px);
  }

  a {
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      display: block;
      height: 1px;
      left: 50%;
      right: 50%;
      position: absolute;
      bottom: 0;
      background: #06F;
      transition-property: left, right;
      transition-duration: 0.3s;
    }

    &:hover {
      color: #06f;

      &::after {
        left: 0;
        right: 0;
      }
    }
  }
}

.none {
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #f5f5f5;
  padding: 35px 0;
  text-align: center;
  color: #aaa;
  font-size: 19px;
  letter-spacing: -1px;
}
</style>