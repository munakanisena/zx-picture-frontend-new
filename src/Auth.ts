import router from '@/router/router.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

//白名单 无需登录即可访问
const whiteList=['/login','/','/rest-password','/timeline']

router.beforeEach( (to, from, next) => {
  const userState=useLoginUserStore().userState
  // 检查路径是否匹配白名单（支持通配符）
  const isAllowed = whiteList.some((pattern) => {
    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -1) // 移除末尾的 '*'，例如 '/picture/'
      return to.path.startsWith(base) // 匹配所有以 '/picture/detail' 开头的路径
    } else {
      return to.path === pattern // 精确匹配其他路径
    }
  })
  if (!isAllowed) {
    if (!userState.isLogin){
      next(`/login?from=${from.fullPath}`)
    }
  }
  next()
})
