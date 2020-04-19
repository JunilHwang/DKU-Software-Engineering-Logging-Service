import { app, store } from './app'
import 'element-ui/lib/theme-chalk/index.css'

const { initPost } = window as any

if (initPost) store.commit('post/INIT_POST', initPost)

app.$mount('#app')