<template>
  <header class="siteHeader">
    <div class="container">
      <div class="siteHeaderLogo">
        <router-link to="/">DKU Developer Logging</router-link>
      </div>
      <site-header-gnb />
    </div>
  </header>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import SiteHeaderGnb from './SiteHeaderGnb'

const components = { SiteHeaderGnb  }
@Component({ components })
export default class SiteHeader extends Vue { }
</script>