//全局自定义请求
import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(['message'])

// axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API_URL
axios.defaults.baseURL = ''
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

// axios.defaults.headers.post['Content-Type'] = 'application/json'

// 全局请求拦截器
axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 全局响应拦截器
axios.interceptors.response.use(
  function (response) {
    if (typeof response.data !== 'object') {
      message.error('服务端异常！')
      return Promise.reject(response)
    }
    //data 业务数据
    const { data } = response

    //只要不是0就进行拦截
    if (data.code !== 0) {
      if (data.message) {
        message.error(data.message)
      }
      //未登录
      if (data.code === 40100) {
        // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
        if (
          !response.request.responseURL.includes('login') &&
          !window.location.pathname.includes('/login')
        ) {
          message.warning('请先登录')
          window.location.href = `/login?redirect=${window.location.href}`
        }
      }
      return Promise.reject(response)
    }
    return data
  },
  (error) => {
    if (error.response.status === 404) {
      message.error('资源不存在')
    }
    if (error.response.status === 500) {
      message.error('网络连接异常')
    }
    console.log(error)
    Promise.reject(error)
  },
)

export default axios
