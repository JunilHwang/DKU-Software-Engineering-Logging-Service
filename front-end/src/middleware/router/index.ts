import Vue from 'vue'
import VueRouter from 'vue-router'
import { Home, Content, Mypage } from '@/views'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/content',
    component: Content
  },
  {
    path: '/mypage',
    component: Mypage
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
