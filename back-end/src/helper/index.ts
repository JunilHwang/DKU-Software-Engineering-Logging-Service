export const httpResponseCheck = async (response: Promise<any>) => {
  try {
    const { statusText, status, config, data } = await response
    const { method, url } = config
    console.log(method, url, status, statusText)
    return data
  } catch (e) {
    console.log('========== this is axios error ==========');
    throw e
  }
}