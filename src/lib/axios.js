import axios from 'axios'
import cfg from '../config'

const singleton = (() => {
  let instance = null

  function createInstance() {
    instance = axios.create({
      baseURL: cfg.serverURL,
      withCredentials: true,
    })
    instance.setToken = token => {
      // console.log('axios>setToken', token)
      // if (token) instance.defaults.headers.common.Authorization = 'Bearer ' + token
      instance.defaults.headers.common.Authorization = token
        ? 'Bearer ' + token
        : ''
      instance.defaults.headers.common['Cache-Control'] = 'no-cache'
      // instance.defaults.withCredentials = token !== null
    }
    // instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    // console.log('create axios', instance.defaults)
    return instance
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    },
  }
})()

export default singleton.getInstance()
