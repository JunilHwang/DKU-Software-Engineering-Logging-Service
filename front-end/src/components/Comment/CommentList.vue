<template>
  <section>

    <header>
      <h2><i class="el-icon-chat-round" /> 댓글 {{ commentList.length }}</h2>
    </header>

    <article
      v-for="{ idx, parent, content, writer: { id, profile: { avatar_url } }, createdAt, to } in commentList"
      :key="idx"
      :class="{ reply: parent }"
    >
      <span class="replyIcon" />
      <ul>
        <li class="commentWriter">
          <figure>
            <img :src="`${avatar_url}&s=30`" :alt="id">
          </figure>
          <span class="commentWriterID" v-html="id" />
        </li>
        <li class="commentCreatedAt">{{ createdAt*1 | fromNow }}</li>
        <li class="commentEdit" v-if="profile !== null">
          <el-button
            @click="$emit('open-form', { idx, type: 'reply' })"
            type="default"
            class="xMini"
            plain>답글</el-button>
          <template v-if="profile.login === id">
            <el-button
              @click="$emit('open-form', { idx, type: 'update' })"
              type="default"
              class="xMini"
              plain>수정</el-button>
            <el-popconfirm
              @onConfirm="remove(idx)"
              title="댓글을 삭제하시겠습니까?"
              cancel-button-text="취소"
              confirm-button-text="확인">
              <el-button slot="reference" class="xMini" type="danger" plain>
                삭제
              </el-button>
            </el-popconfirm>
          </template>
        </li>
      </ul>
      <div class="commentContent">
        <router-link class="commentReplyTo" :to="`/user/${to}`" v-if="to.length" v-html="`@${to}`" />
        <div v-html="content.split('\n').join('<br />')" />
      </div>
    </article>
    <p class="noComment" v-if="commentList.length === 0">
      작성된 댓글이 없습니다.
    </p>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { namespace } from 'vuex-class'
import { Comment, GithubProfile } from '@Domain'
import CommentForm from './CommentForm.vue'

const components = { CommentForm }
const commentStore = namespace('comment')
const userStore = namespace('user')

@Component({ components })
export default class CommentList extends Vue {
  @commentStore.Action private DELETE_COMMENT!: ActionMethod
  @commentStore.State private commentList!: Comment[]
  @userStore.State private profile!: GithubProfile|null

  private async remove (idx: number): Promise<void> {
    const post = this.$route.params.idx
    await this.DELETE_COMMENT({ idx, post })
    this.$message({ type: 'success', message: '댓글이 삭제되었습니다.' })
  }

}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/lib";

ul, li, div, section, header, article, p, figure {
  margin: 0;
  padding: 0;
}

img {
  vertical-align: middle;
}

ul, li {
  list-style: none;
  display: flex;
  align-items: center;
}

ul {
  font-family: enFont();
}

section {
  margin-bottom: 30px;
}

header {
  margin-bottom: 10px;
}

h2 {
  font-weight: 400;
  margin: 0;
  font-size: 21px;
}

.el-icon-chat-round {
  display: inline-block;
  transform: translateY(1px);
}

article {
  padding: 15px;
  border-top: 1px dotted #ddd;

  header + & {
    border-top: 1px solid #eee;
    margin-top: 20px;
  }

  &:last-child {
    border-bottom: 1px solid #eee;
  }
  &.reply {
    border-top: none;
    background: #f7f7f7;
    margin: 10px 0 30px 30px;
    border-radius: 0 5px 5px 5px;
    position: relative;
  }


  .replyIcon {
    display: block;
    position: absolute;
    left: 0;
    top: -20px;
    width: 20px;
    height: 20px;
    background: #f7f7f7;
    overflow: hidden;

    &::before {
      content: "";
      display: block;
      width: 40px;
      height: 40px;
      border-radius: 40px;
      margin-top: -20px;
      background: #fff;
    }

  }
}

figure {
  @include img-wrap();
  width: 30px;
  height: 30px;
  border-radius: 30px;
  overflow: hidden;
}

.comment {

  &WriterID {
    font-size: 15px;
    margin-left: 5px;
  }

  &CreatedAt {
    font-size: 13px;
    color: #aaa;
    margin-left: 10px;
  }

  &Edit {
    margin-left: auto
  }

  &Content {
    margin-top: 10px;
    line-height: 1.5;
    min-height: calc(15px * (1.5 * 2));
    letter-spacing: -0.5px;
  }

  &Reply {
    transform: rotateZ(180deg);

    &To {
      color: #06F;
      float: left;
      margin-right: 5px;
      font-weight: 600;
    }
  }
}

.noComment {
  text-align: center;
  background: #fafafa;
  padding: 30px;
  color: #aaa;
  border-radius: 5px;
  border: 1px solid #eee;
}

.xMini {
  padding: 5px 7px;
  font-size: 11px;
  margin-left: 5px !important;
}


</style>