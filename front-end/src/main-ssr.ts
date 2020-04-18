import { createApp } from './app'
import { SSRContext } from 'domain/dist'

export default (context: SSRContext) => new Promise(async (resolve, reject) => {
  const { app, router, store } = createApp()

  if (context.selectedPost !== null) {
    store.commit('post/INIT_POST', context.selectedPost)
  }

  await router.push(context.url)
  router.onReady(() => {
    resolve(app)
  }, reject)
})