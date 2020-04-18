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
      <el-table-column label="삭제" width="150" align="center">
        <template slot-scope="scope">
          <el-popconfirm
            @onConfirm="remove(scope.row.idx)"
            title="삭제하시겠습니까?"
            confirm-button-text="확인"
            cancel-button-text="취소">
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" plain circle />
          </el-popconfirm>
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
import { namespace } from 'vuex-class'
import { GithubHook, GithubRepository } from 'domain/src'
import { AccessToken } from '@/middleware/store/types'
import { githubClientService } from '@/services'
import { GithubRepositoryList } from '@/components'

const components = { GithubRepositoryList }
const userStore = namespace('user')
const githubStore = namespace('github')

@Component({ components })
export default class Hook extends Vue {
  @userStore.State private access_token!: AccessToken
  @githubStore.State private hookList!: GithubHook[]
  @githubStore.Action private FETCH_GITHUB_HOOK!: ActionMethod
  @githubStore.Action private DELETE_GITHUB_HOOK!: ActionMethod
  @githubStore.Action private ADD_GITHUB_HOOK!: ActionMethod

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
    await this.DELETE_GITHUB_HOOK(idx)
    this.$message({ type: 'success', message: '삭제되었습니다.' })
  }

  private add (repo: GithubRepository) {
    const confirmMsg: string = '정말로 추가하시겠습니까?'
    const confirmTitle: string = 'Hook 추가'
    const confirmButtonText: string = '확인'
    const cancelButtonText: string = '취소'
    const type: 'warning' = 'warning'

    this
      .$confirm(confirmMsg, confirmTitle, { type, confirmButtonText, cancelButtonText })
      .then(async () => {
        await this.ADD_GITHUB_HOOK(repo.full_name)
        this.$message({ type: 'success', message: '추가 되었습니다.' })
        this.repositories.close()
      })
      .catch(() => {
        this.$message({ type: 'info', message: '취소되었습니다.' })
      })
  }

  private async mounted () {
    await this.FETCH_GITHUB_HOOK()
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