import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { getLoginUserDetailUsingGet, userLogoutUsingPost } from '@/api/userController.ts'

interface UserRepository{
  isLogin:boolean
  uerInfo:API.LoginUserDetailVO
}

//登录用户的状态管理文件
export const useLoginUserStore = defineStore('USER_INFO', () => {
  //注意这里需要使用 reactive 来包裹对象，否则在修改对象属性时不会触发更新
  const userState = reactive<UserRepository>({
    isLogin: false,
    uerInfo: {},
  })

    // 改为登录后将数据存储浏览器中 无需每次登录获取信息
    // 标记是否已初始化
  // const initialized = ref(false)
  //
  // async function useInitUser() {
  //   // 如果已初始化，直接返回
  //   if (initialized.value) return
  //
  //   try {
  //     const { data } = await getLoginUserDetailUsingGet()
  //     setLoginUser(data)
  //     initialized.value = true // 标记为已初始化
  //   } catch (error) {
  //     console.error('初始化用户失败:', error)
  //     //只初始化一次
  //     initialized.value=true
  //   }
  // }

  /**
   * 设置登录用户
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: API.LoginUserDetailVO) {
    if (!newLoginUser) {
      throw new Error('用户数据不可为空');
    }
    userState.isLogin=true
    userState.uerInfo=newLoginUser
  }

  async function logout() {
    await userLogoutUsingPost();
    userState.isLogin=false
    userState.uerInfo={}
  }

  async function refreshUser() {
    const { data } = await getLoginUserDetailUsingGet()
    setLoginUser(data)
  }


  return { userState, setLoginUser ,logout, refreshUser }
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
})
