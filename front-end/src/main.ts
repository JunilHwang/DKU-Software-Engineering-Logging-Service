import { createApp } from './app'
import 'element-ui/lib/theme-chalk/index.css'
import { store } from './middleware'

const { app } = createApp({}, store)

app.$mount('#app')