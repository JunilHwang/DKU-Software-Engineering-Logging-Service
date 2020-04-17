import Vue from 'vue'
import App from './App.vue'
import { createRouter, createStore } from './middleware'
import ElementUI from 'element-ui'
import './filter'
import './middleware/icon'

Vue.config.productionTip = false

const locale = require('element-ui/lib/locale/lang/ko')

Vue.use(ElementUI, { locale })

export const createApp = (context: { [k: string]: string }) => {
  const router = createRouter()
  const store = createStore(context)
  const render = (h: Function) => h(App)
  const app = new Vue({ router, store, render })
  return { app, router, store }
}
