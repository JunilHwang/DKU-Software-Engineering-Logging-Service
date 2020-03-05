<template>
  <div class="markdownWrapper">
    <div ref="markdownContent" class="markdownContent" v-html="markdownContent" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State} from 'vuex-class'
import { md } from '@/middleware'

const rawURL = 'https://raw.githubusercontent.com'

@Component
export default class Markdown extends Vue {
  @State(state => state.github.content) content!: string
  @State(state => state.github.route) route!: string[]
  @State(state => state.user.profile.login) user!: string

  private get markdownContent () {
    if (this.content.length === 0) return ''
    const before = md.render(this.content.replace(/(```.*)(\{.*\})/g, '$1') || '')
    const div = document.createElement('div')
    const head = [...this.route].splice(0, 2).join('/')
    const tail = [...this.route].splice(2).join('/')

    div.innerHTML = before

    // img 치환
    div.querySelectorAll('img')
      .forEach((v: HTMLElement) => {
        const src = v.getAttribute('src')!
        if (src.indexOf('http') !== 0) {
          v.setAttribute('src', `${rawURL}/${head}/master/${tail}/../${src}`)
        }
      })

    return div.innerHTML
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
  }
}
</style>