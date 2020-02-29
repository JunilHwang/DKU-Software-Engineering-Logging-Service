<template>
  <div class="markdownWrapper">
    <div class="markdownContent" v-html="markdownContent" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { md } from '@/middleware'

@Component
export default class Markdown extends Vue {
  @Prop() content!: string

  private get markdownContent () {
    return md.render(this.content.replace(/(```.*)(\{.*\})/g, '$1'))
  }
}
</script>

<style lang="scss">
.markdown {
  &Content {
    line-height: 160%;
    color: #333;
  }
  &Container {
    background: #f5f5f5;
    padding: 20px;
    border-left: 8px solid #09F;
    margin-bottom: 20px;
    &Title {
      font-size: 19px;
      color: #06F;
    }
  }
}
</style>