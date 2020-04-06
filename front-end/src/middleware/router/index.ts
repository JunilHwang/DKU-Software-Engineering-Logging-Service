import Vue from 'vue'
import VueRouter from 'vue-router'
import { Home, Content, User, Post, Setting, Hook } from '@/views'

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
    path: '/user/:userId',
    component: User
  },
  {
    path: '/post/:idx',
    component: Post
  },
  {
    path: '/setting',
    component: Setting,
    children: [
      {
        alias: '',
        path: 'hook',
        component: Hook
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
