import { createApp } from './app'
import { SSRContext } from 'domain/dist'

export default (context: SSRContext) => new Promise(async (resolve, reject) => {
  const { app, router, store } = createApp()
  await router.push(context.url)

  router.onReady(() => {
    if (context.selectedPost) {
      store.commit('post/INIT_POST', context.selectedPost)
    }
    resolve(app)
  }, reject)
})