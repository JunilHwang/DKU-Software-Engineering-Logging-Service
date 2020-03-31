<template>
  <section class="postWrapper">
    <article
      class="postArticle"
      v-for="{ idx, thumbnail, sha, title, description, createdAt, likes, writerId, writerProfile, comments } in data"
      :key="idx"
    >
      <router-link :to="`/post/${idx}`">
        <figure class="postArticleThumbnail">
          <img v-if="thumbnail" :src="`/uploaded/${sha}`" :alt="title" />
          <div class="postArticleNoneThumbnail" v-else>
            <i class="el-icon-camera" />
            <span>No Image</span>
          </div>
        </figure>
        <h2 class="postArticleSubject" v-html="title" />
        <p class="postArticleDescription" v-html="description" />
        <div class="postArticleInfo">
          <span class="postArticleDate">{{ createdAt * 1 | dateformat }}</span>
          <div class="postArticleLikes">
            <fa :icon="['fas', 'heart']" size="xs" />
            <span>{{ likes }}</span>
          </div>
          <div class="postArticleComments">
            <i class="el-icon-chat-line-round" />
            <span>{{ comments }}</span>
          </div>
        </div>
        <router-link v-if="writerId" :to="`/user/${writerId}`" class="postArticleWriter">
          <figure class="postArticleWriterAvatar">
            <img :src="`${writerProfile.avatar_url}&s=30`" :alt="writerId">
          </figure>
          <span class="postArticleWriterLabel" v-html="writerId" />
        </router-link>
      </router-link>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { PostView } from '@Domain'

@Component
export default class PostList extends Vue {
  @Prop({ type: Array, default: () => [] }) private data!: PostView[]
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/lib";

p {
  margin: 0;
  padding: 0;
}

.post {
  &Wrapper {
    @include clear-fix();
  }

  &Article {
    border: 1px solid #ddd;
    margin-bottom: 20px;
    margin-left: 20px;
    float: left;
    width: 320px;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 3px;
    box-shadow: 0 0 10px fade-out(#aaa, 1);
    transition: box-shadow 0.3s;
    background: #fff;

    &:hover {
      box-shadow: 0 0 10px fade-out(#aaa, 0.7);
    }

    &:nth-child(3n + 1) {
      margin-left: 0
    }

    &Thumbnail {
      @include img-wrap();
      height: (9 / 16) * 320px;
      margin: -20px -20px 20px;
    }

    &NoneThumbnail {
      height: 100%;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 25px;
      color: #aaa;
      i {
        font-size: 35px;
        margin: 2px 10px 0 0;
      }
    }

    &Subject {
      display: -webkit-box;
      font-size: 17px;
      line-height: 1;
      height: 17px;
      font-weight: 600;
      margin: 0 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    &Description {
      display: -webkit-box;
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-all;
      overflow-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 13px * 4.5;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      color: #666;
    }

    &Info {
      display: flex;
      align-items: center;
      margin: 10px 0;
    }

    &Likes,
    &Comments{
      font-size: 13px;

      * {
        display: inline-block;
        vertical-align: middle;
      }

      span {
        margin-left: 3px;
        transform: translateY(-1px);
      }
    }

    &Likes {
      margin-left: auto;
    }

    &Comments {
      margin-left: 10px;
    }

    &Date {
      font-size: 13px;
      color: #aaa;
    }

    &Writer {
      display: flex;
      align-items: center;
      font-family: enFont();

      &Avatar {
        margin: 0;
        pdding: 0;
        overflow: hidden;
        @include circle(30px);
        @include img-wrap();
      }

      &Label {
        margin-left: 10px;
      }
    }
  }

}
</style>