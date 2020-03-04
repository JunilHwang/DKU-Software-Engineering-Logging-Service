<template>
  <div class="markdownWrapper">
    <div class="markdownContent" v-html="markdownContent" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { md } from '@/middleware'
import { State} from 'vuex-class';

@Component
export default class Markdown extends Vue {
  @State(state => state.github.content) content!: string

  private get markdownContent () {
    return md.render(this.content.replace(/(```.*)(\{.*\})/g, '$1') || '')
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
      background: #f9f1f3;
      color: #ff3860;
      padding: .25rem .5rem;
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