<template>
  <section class="postWrapper">
    <article class="postArticle" v-for="(v, k) in data" :key="k">
      <router-link :to="`/post/${v.idx}`">
        <figure class="postArticleThumbnail">
          <img :src="`/uploaded/${v.sha}`" :alt="v.title" v-if="v.thumbnail.length" />
          <div class="postArticleNoneThumbnail" v-else>
            <i class="el-icon-camera" />
            <span>No Image</span>
          </div>
        </figure>
        <h2 class="postArticleSubject" v-html="v.title" />
        <p class="postArticleDescription" v-html="v.description" />
        <p class="postArticleDate">{{ v.createdAt * 1 | dateformat }}</p>
        <div class="postArticleWriter" v-if="v.writer">
          <figure class="postArticleWriterAvatar">
            <img :src="`${v.writer.profile.avatar_url}&s=30`" :alt="v.writer.id">
          </figure>
          <span class="postArticleWriterLabel" v-html="v.writer.id" />
        </div>
      </router-link>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Post } from '@Domain'

@Component
export default class PostList extends Vue {
  @Prop({ type: Array, default: () => [] }) private data!: Post[]
}
</script>