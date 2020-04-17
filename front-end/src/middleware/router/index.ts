import Vue from 'vue'
import VueRouter from 'vue-router'
import { Home, Content, User, Post, Setting } from '@/views'

Vue.use(VueRouter)

export const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
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
    },
  ]
})
