import { createApp } from './app'

export default (context: { [k: string]: string }) => new Promise(async (resolve, reject) => {
  const { app, router } = createApp(context)
  await router.push(context.url)
  router.onReady(() => {
    resolve(app)
  }, reject)
})