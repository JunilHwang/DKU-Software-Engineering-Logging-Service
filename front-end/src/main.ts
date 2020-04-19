import { createApp } from './app'
import 'element-ui/lib/theme-chalk/index.css'
import { storeContainer } from './helper'

const { app, store }  = createApp()

const { __INITIAL_STATE__ } = window as any
if (__INITIAL_STATE__) store.replaceState(__INITIAL_STATE__)

storeContainer.set(store)

app.$mount('#app', true)