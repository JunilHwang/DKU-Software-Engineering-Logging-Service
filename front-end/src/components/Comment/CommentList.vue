<template>
  <section>
    <header>
      댓글 {{ commentList.length }}
    </header>
    <article
      v-for="{ idx, depth, content, writer: { id, profile: { avatar_url } }, createdAt } in commentList"
      :key="idx"
      :style="{ paddingLeft: `${depth * 20}px` }"
    >
      <ul>
        <li class="commentWriter">
          <figure>
            <img :src="`${avatar_url}&s=30`" :alt="id">
          </figure>
          <span class="commentWriterID" v-html="id" />
        </li>
        <li class="commentCreatedAt">{{ createdAt*1 | fromNow }}</li>
      </ul>
      <div class="commentContent" v-html="content" />
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ActionMethod } from 'vuex'
import { Action, State } from 'vuex-class'
import { FETCH_COMMENT } from '@/middleware/store/types'
import { Comment } from '@Domain'

@Component
export default class CommentList extends Vue {

  @Action(FETCH_COMMENT) fetchComment!: ActionMethod
  @State(state => state.comment.commentList) commentList!: Comment[]

  created () {
    this.fetchComment(this.$route.params.idx)
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
  padding: 70px 0;

  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    width: 100px;
    z-index: 10;
    background: #f5f5f5;
  }
}

header {
  font-size: 21px;
  margin-bottom: 10px;
}

article {
  border-bottom: 1px dotted #ddd;
  padding: 20px 0;
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
  &Content {
    margin-top: 10px;
    line-height: 1.5;
  }
}


</style>