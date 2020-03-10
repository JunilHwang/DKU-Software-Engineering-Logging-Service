<template>
  <nav id="markdown-sidebar" class="markdownSidebar">
    <ul>
      <li v-for="({ name, href, idx, children }, k) in sidebar" :key="k">
        <a :href="href" :data-idx="idx" v-html="name" />
        <ul v-if="children.length">
          <li v-for="({ name, href, idx }, k2) in children" :key="k2">
            <a :href="href" :data-idx="idx" v-html="name" />
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { sidebarAutoActive } from '@/helper'

@Component
export default class MarkdownSidebar extends Vue {
  @Prop({ type: String, default: '' }) content!: string
  get sidebar () {
    const wrap = document.createElement('div')
    wrap.innerHTML = this.content
    const head = wrap.querySelectorAll<HTMLElement>('h2,h3')
    const sidebar: any = []
    let prev: any = null
    head.forEach((v: HTMLElement, idx: number) => {
      const n = ~~v.nodeName.toLowerCase().replace('h', '')
      const name = v.textContent!.replace('# ', '')
      const link = v.querySelector('a')!
      const href = link.getAttribute('href')
      const params = { name, href, idx }
      if (n === 2 || prev === null) {
        const properties = { ...params, children: [] }
        sidebar.push(properties)
        if (n === 2) prev = { ...properties }
      } else {
        prev.children.push(params)
      }
    })
    return sidebar
  }

  mounted () {
    sidebarAutoActive()
  }
}
</script>

<style lang="scss">
.markdownSidebar {
  position: fixed;
  left: calc(50% + 440px);
  top: 100px;

  ul, li {
    list-style: none
  }

  ul ul {
    padding-inline-start: 15px;
  }

  a {
    display: block;
    line-height: 1.8;
    color: #aaa;
    font-size: 13px;

    &.active {
      color: #06F
    }

    + ul {
      margin: 5px 0 10px;
      a {
        font-size: 11px;
      }
    }
  }
}
</style>