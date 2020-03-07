<template>
  <section class="postWrapper">
    <article v-for="(v, k) in data" :key="k">
      <h2>{{ v.title }}</h2>
      <p>{{ v.createdAt }}</p>
      <p>
        <figure>
          <img :src="v.writer.profile.avatar_url" :alt="v.writer.id">
        </figure>
        {{ v.writer.id }}
      </p>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Post } from '@Domain'

@Component
export default class PostList extends Vue {
  @Prop({ type: Array, default: [] }) private data!: Post[]
}
</script>