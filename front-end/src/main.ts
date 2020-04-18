import { createApp } from './app'
import 'element-ui/lib/theme-chalk/index.css'

const { app, store } = createApp()

export { store }

store.replaceState((window as any).__INITIAL_STATE__)

app.$mount('#app')