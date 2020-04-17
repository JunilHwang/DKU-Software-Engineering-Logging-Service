import Vue from 'vue'
import App from './App.vue'
import { createRouter, createStore } from './middleware'
import ElementUI from 'element-ui'
import './filter'
import './middleware/icon'
import {RootState} from "@/middleware/store/types";
import {Store} from "vuex";

Vue.config.productionTip = false

const locale = require('element-ui/lib/locale/lang/ko')

Vue.use(ElementUI, { locale })

export const createApp = (context: { [k: string]: string }, provideStore?: Store<RootState>) => {
  const router = createRouter()
  const store = provideStore || createStore(context)
  const render = (h: Function) => h(App)
  const app = new Vue({ router, store, render })
  return { app, router, store }
}
