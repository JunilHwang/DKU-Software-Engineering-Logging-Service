import { createApp } from './app'
import { SSRContext } from 'domain/dist'

export default (context: SSRContext) => new Promise(async (resolve, reject) => {
  const { app, router, store } = createApp()
  await router.push(context.url)

  router.onReady(() => {
    const { selectedPost, user } = context
    if (selectedPost) {
      store.commit('post/INIT', selectedPost)
    }
    if (user) {
      store.commit('user/INIT', user)
    }

    context.rendered = () => {
      context.state = store.state
    }

    resolve(app)
  }, reject)
})