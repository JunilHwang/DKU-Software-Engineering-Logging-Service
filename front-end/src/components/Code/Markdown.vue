<template>
  <div class="markdownWrapper">
    <slot name="header" />
    <div ref="markdownContent" class="markdownContent" v-html="markdownContent" />
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { md } from '@/middleware'
import { getContentWithoutFrontmatter } from '@/helper'

@Component
export default class Markdown extends Vue {
  @Prop({ type: String, default: '' }) content!: string

  private get markdownContent () {
    if (this.content.length === 0) return ''
    return md.render(getContentWithoutFrontmatter(this.content))
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Serif+KR&display=swap');

.markdown {
  &Content {
    font-family: 'Noto Serif KR', serif, Nanum Gothic, Malgun Gothic, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
    line-height: 1.6;
    color: #333;
    letter-spacing: -0.5px;

    h1 {
      margin-bottom: 50px
    }

    h2 {
      margin: 30px 0 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
    }

    code:not(.hljs) {
      display: inline-block;
      background: #f9f1f3;
      color: #ff3860;
      padding: 0 .25rem;
      font-size: 0.85em;
      border-radius: 3px;
      margin: 0;
    }

    a {
      color: #09F;
      &:hover {
        text-decoration: underline;
      }
    }

    li {
      line-height: 1.7
    }

    img {
      max-width: 100%
    }

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

    code:not(.hljs) {
      box-shadow: 0 0 1px #777;
      margin: 0 0.25rem
    }
  }
}
</style>