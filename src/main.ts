import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/router.ts'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//自定义的 访问(权限)校验
import '@/Auth.ts'

const app = createApp(App)
const pinia = createPinia()

//pinia持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
