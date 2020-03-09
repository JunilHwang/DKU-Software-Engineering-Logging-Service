<template>
  <div class="markdownWrapper">
    <slot name="header" />
    <div ref="markdownContent" class="markdownContent" v-html="markdownContent" />
    <markdown-sidebar v-if="isSidebar" :content="markdownContent" />
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { md } from '@/middleware'
import { getContentWithoutFrontmatter } from '@/helper'
import { MarkdownSidebar } from './index'

const components = { MarkdownSidebar }

@Component({ components })
export default class Markdown extends Vue {
  @Prop({ type: String, default: '' }) content!: string
  @Prop({ type: Boolean, default: false }) isSidebar!: boolean

  private get markdownContent () {
    if (this.content.length === 0) return ''
    return md.render(getContentWithoutFrontmatter(this.content))
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Serif+KR&display=swap');

.markdown {
  &Wrapper {
    position: relative;
  }

  &Content {
    font-family: 'Noto Serif KR', serif, Nanum Gothic, Malgun Gothic, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
    line-height: 1.6;
    color: #333;
    letter-spacing: -0.5px;

    h2 {
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

    .header-anchor {
      float: left;
      margin-left: -0.75em;
      opacity: 0
    }

    h1, h2, h3, h4, h5 ,h6 {
      margin-top: -60px;
      padding-top: 80px;
      margin-bottom: 0;
      position: relative;
      &:hover .header-anchor {
        opacity: 1
      }
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