import { createApp } from './app'
import { SSRContext } from 'domain/dist'
import { sync } from 'vuex-router-sync'

export default (context: SSRContext) => new Promise(async (resolve, reject) => {
  const { app, router, store } = createApp()
  await router.push(context.url)

  sync(store, router)

  if (context.selectedPost) {
    store.commit('post/INIT_POST', context.selectedPost)
  }

  router.onReady(() => resolve(app), reject)
})