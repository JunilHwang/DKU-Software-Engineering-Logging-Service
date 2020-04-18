import { createApp } from './app'
import { SSRContext } from 'domain/dist'

export default (context: SSRContext) => new Promise(async (resolve, reject) => {
  const { app, router, store } = createApp()

  await router.push(context.url)
  router.onReady(() => {
    if (context.selectedPost !== null) {
      store.commit('post/INIT_POST', context.selectedPost)
    }
    context.rendered = () => {
      console.log('=====================rendered=====================')
      console.log('selectedPost: ', store.state.post.selectedPost)
      context.state = store.state
    }
    resolve(app)

  }, reject)
})