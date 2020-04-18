import { app, store } from './app'
import 'element-ui/lib/theme-chalk/index.css'

const $global: any = window

if ($global.__INITIAL_STATE__) {
  store.replaceState($global.__INITIAL_STATE__)
}

app.$mount('#app')