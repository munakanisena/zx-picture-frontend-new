import router from '@/router/router.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

//白名单 无需登录即可访问
const whiteList = ['/login', '/', '/rest-password', '/timeline', '/picture/detail/*']

router.beforeEach((to, from, next) => {
  // 检查路径是否匹配白名单（支持通配符）
  const isAllowed = whiteList.some((pattern) => {
    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -1)
      return to.path.startsWith(base)
    } else {
      return to.path === pattern
    }
  })
  if (!isAllowed) {
    if (!useLoginUserStore().isLogin) {
      next(`/login?from=${from.fullPath}`)
      return
    }
  }
  next()
})
