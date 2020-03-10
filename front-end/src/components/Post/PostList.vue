<template>
  <section class="postWrapper">
    <article class="postArticle" v-for="(v, k) in data" :key="k">
      <h2 class="postArticleSubject">
        <router-link :to="`/post/${v.idx}`" v-html="v.title" />
      </h2>
      <p class="postArticleDate">{{ v.createdAt * 1 | dateformat }}</p>
      <div class="postArticleWriter" v-if="v.writer">
        <figure class="postArticleWriterAvatar">
          <img :src="`${v.writer.profile.avatar_url}&s=30`" :alt="v.writer.id">
        </figure>
        <span class="postArticleWriterLabel" v-html="v.writer.id" />
      </div>
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