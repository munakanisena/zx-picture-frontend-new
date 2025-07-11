import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getLoginUserDetailUsingGet, userLogoutUsingPost } from '@/api/userController.ts'
import router from '@/router/router.ts'

export const useLoginUserStore = defineStore(
  'USER_INFO',
  () => {
    const userInfo = ref<API.UserDetailVO>({})
    const isLogin = computed(() => !!userInfo.value && !!userInfo.value.id)

    /**
     * 检查是否登录
     */
    function checkLogin() {
      if (!isLogin.value) {
        router.push({name: 'login' })
      }
      return
    }

    /**
     * 设置登录用户 (Action)
     * @param newLoginUser
     */
    function setLoginUser(newLoginUser: API.UserDetailVO) {
      if (!newLoginUser || !newLoginUser.id) {
        throw new Error('用户数据或用户ID不可为空')
      }
      userInfo.value = newLoginUser
    }

    /**
     * 用户登出 (Action)
     */
    async function logout() {
      try {
        await userLogoutUsingPost()
      } catch (e) {
        console.error('登出失败', e)
      } finally {
        userInfo.value = {}
      }
    }

    /**
     * 刷新当前用户信息 (Action)
     */
    async function refreshUser() {
      //没登录无需刷新
      if (!isLogin.value) {
        return
      }
      try {
        const res = await getLoginUserDetailUsingGet()
        if (res.data) {
          userInfo.value = res.data
        } else {
          await logout()
        }
      } catch (e) {
        await logout()
      }
    }

    return { userInfo, isLogin, setLoginUser, logout, refreshUser,checkLogin }
  },
  //存储选项
  {
    persist: {
      //开启持久化
      enabled: true,
      strategies: [
        {
          key: 'USER_INFO',
          storage: localStorage,
        },
      ],
    },
  },
)
