import { app, store } from './app'
import 'element-ui/lib/theme-chalk/index.css'

const { initState } = window as any

if (initState) {
  const { initPost } = initState
  if (initPost) {
    console.log(initPost)
    store.commit('post/INIT_POST', initPost)
  }
}

app.$mount('#app')