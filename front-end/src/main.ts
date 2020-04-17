import { createApp } from './app'
import 'element-ui/lib/theme-chalk/index.css'

const { app, store, router } = createApp({ })

export { store, router }

app.$mount('#app')