import { createApp } from './app'
import 'element-ui/lib/theme-chalk/index.css'
import { storeContainer } from './helper'

const { initPost } = window as any

const { app, store }  = createApp()

if (initPost) store.commit('post/INIT_POST', initPost)

storeContainer.set(store)

app.$mount('#app')