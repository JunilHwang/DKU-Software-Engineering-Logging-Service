<template>
  <div class="markdownWrapper">
    <markdown-it-vue />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { md } from '@/middleware'

@Component
export default class Markdown extends Vue {
  @Prop() content!: string

  private get markdownContent () {
    return md.render(this.content)
  }
}
</script>