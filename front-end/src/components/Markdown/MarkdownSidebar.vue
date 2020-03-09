<template>
  <nav class="markdownSidebar">
    <ul>
      <li v-for="(dep1, k) in sidebar" :key="k">
        <a href="#">{{ dep1.name }}</a>
        <ul v-if="dep1.children.length">
          <li v-for="(dep2, k2) in dep1.children" :key="k2">
            <a href="#">{{ dep2.name }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MarkdownSidebar extends Vue {
  @Prop({ type: String, default: '' }) content!: string
  get sidebar () {
    const wrap = document.createElement('div')
    wrap.innerHTML = this.content
    const head = wrap.querySelectorAll<HTMLElement>('h2,h3')
    const sidebar: any = []
    let prev: any = {}
    head.forEach((v: HTMLElement) => {
      const n = ~~v.nodeName.toLowerCase().replace('h', '')
      if (n === 2) {
        prev = { name: v.textContent, children: [] }
        sidebar.push(prev)
      } else {
        prev.children.push({ name: v.textContent })
      }
    })
    return sidebar
  }
}
</script>