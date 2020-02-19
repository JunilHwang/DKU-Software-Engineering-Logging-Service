<template>
  <header class="siteHeader">
    <div class="container">
      <div class="siteHeaderLogo">
        <router-link to="/">DKU Developer Logging</router-link>
      </div>
      <nav class="gnb">
        <ul>
          <li><router-link to="/">Repositories</router-link></li>
          <li><router-link to="/content">Content</router-link></li>
          <li>
            <el-button type="default" size="small" round>
              Login With <strong>GitHub</strong>
            </el-button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>