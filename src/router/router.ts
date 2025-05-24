import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // /* 此时，AuthLayout.vue 会作为 所有子路由的父容器，例如访问 /login 时，会先渲染 AuthLayout.vue，再在其内部渲染 Login.vue。
      path: '/*',
      component: () => import('../pages/auth/AuthLayout.vue'),
      children: [
        {
          path: '/login',
          name: 'login',
          meta: { title: '登录' },
          component: () => import('../pages/auth/Login.vue'),
          props: (route) => ({ from: route.query.from }),
        },
        {
          path: '/rest-password',
          name: 'rest-password',
          meta: { title: '重置密码' },
          component: () => import('../pages/auth/ResetPassword.vue'),
        },
      ],
    },
    {
      path: '/*',
      component: () => import('../pages/MainLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          meta: { title: '首页' },
          component: () => import('../pages/home/Home.vue'),
        },
        {
          path: '/user-profile',
          name: 'user-profile',
          meta: { title: '个人资料' },
          component: () => import('../pages/user/UserProfile.vue'),
        },

        //------------管理员页面--------------
        {
          path:'/admin/user-manager',
          name: 'user-manager',
          meta: { title: '用户管理' },
          component: () => import('../pages/admin/UserManager.vue'),
        },
        {
          path: '/timeline',
          name: 'timeline',
          meta: { title: '项目开发历程' },
          component: () => import('../pages/TimeLine.vue'),
        },
        {
          path: '/:pathMath(.*)',
          component: () => import('../pages/other/NotFound.vue'),
        },
      ],
    },
  ],
})

/**
 * 标签转换
 */
router.afterEach((to, from) => {
  const definedTitle = '惠眸图界'
  const title = to.meta.title
  if (title !== undefined) {
    document.title = title + ' | ' + definedTitle
  } else {
    document.title = definedTitle
  }
})

export default router
