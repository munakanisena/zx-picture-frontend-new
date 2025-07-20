import { createRouter, createWebHistory } from 'vue-router'
import {
  getPrivateSpaceDetailByLoginUserUsingGet,
  getTeamSpaceDetailByLoginUserUsingGet,
} from '@/api/spaceController.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      //此时，AuthLayout.vue 会作为 所有子路由的父容器，例如访问 /login 时，
      //会先渲染 AuthLayout.vue，再在其内部渲染 Login.vue。
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
        {
          path: '/user-edit',
          name: 'user-edit',
          meta: { title: '编辑资料' },
          component: () => import('../pages/user/UserEdit.vue'),
        },
        //--------------图片页面--------------
        {
          path: '/picture-upload',
          name: 'picture-upload',
          meta: { title: '上传图片' },
          component: () => import('../pages/picture/PictureUpload.vue'),
        },
        {
          path: '/picture-upload/batch',
          name: 'picture-upload-batch',
          meta: { title: '批量上传图片' },
          component: () => import('../pages/picture/PictureUploadBatch.vue'),
        },
        {
          path: '/picture/detail/:pictureId',
          name: 'picture-detail',
          meta: { title: '图片详情' },
          props: true,
          component: () => import('../pages/picture/PictureDetail.vue'),
        },
        {
          path: '/picture-edit/:pictureId',
          name: 'picture-edit',
          meta: { title: '编辑图片' },
          props: (route)=>({
              pictureId :route.params.pictureId,
              spaceId:route.query.space_id,
              spaceName:route.query.space_name,
              spaceType:route.query.space_type
          }),
          component: () => import('../pages/picture/PictureEdit.vue'),
        },
        {
          path: '/picture-ai/extend/:pictureId',
          name: 'picture-ai-extend',
          meta: { title: 'AI扩图' },
          props: true,
          component: () => import('../pages/picture/PictureAIExtend.vue'),
        },
        {
          path: '/picture-capture',
          name: 'picture-capture',
          meta: { title: '抓取图片' },
          component: () => import('../pages/picture/PictureCapture.vue'),
        },
        {
          path: '/picture-search/by-picture',
          name: 'picture-search-by-picture',
          meta: { title: '以图搜图' },
          component: () => import('../pages/picture/PictureSearchByPicture.vue'),
        },
        {
          path: '/picture-collect',
          name: 'picture-collect',
          meta: { title: '图片收藏' },
          component: () => import('../pages/picture/PictureCollect.vue'),
        },

        //空间模块
        {
          path: '/space-active',
          name: 'space-active',
          meta: { title: '激活空间' },
          component: () => import('../pages/space/SpaceActive.vue'),
        },
        {
          path: '/space/person',
          name: 'space-person',
          meta: { title: '个人空间' },
          component: () => import('../pages/space/Space.vue'),
          beforeEnter: async (to, from, next) => {
            try {
              const { data } = await getPrivateSpaceDetailByLoginUserUsingGet()
              if (data == null) {
                next({ name: 'space-active', query: { type: SPACE_TYPE_ENUM.PRIVATE } })
              } else {
                next()
              }
            } catch (error) {
              console.error('获取团队空间详情失败:', error)
              next({ name: 'space-active', query: { type: SPACE_TYPE_ENUM.PRIVATE } })
            }
          },
        },
        {
          path: '/space/team',
          name: 'space-team',
          meta: { title: '团队空间' },
          component: () => import('../pages/space/TeamSpace.vue'),
          beforeEnter: async (to, from, next) => {
            try {
              //如果是前往的加入的团队空间 直接放行
              if (!!to.query?.space_id) {
                next()
                return
              }
              const { data } = await getTeamSpaceDetailByLoginUserUsingGet()
              if (data == null) {
                next({ name: 'space-active', query: { type: SPACE_TYPE_ENUM.TEAM } })
              } else {
                next()
              }
            } catch (error) {
              console.error('获取团队空间详情失败:', error)
              next({ name: 'space-active', query: { type: SPACE_TYPE_ENUM.TEAM } })
            }
          },
        },
        {
          path: '/space/team/join',
          name: 'space-team-join',
          meta: { title: '加入团队' },
          component: () => import('../pages/space/TeamSpaceJoin.vue'),
        },
        {
          path: '/space/team/member/:spaceId',
          name: 'space-team-member',
          meta: { title: '团队成员' },
          props: true,
          component: () => import('../pages/space/TeamSpaceMember.vue'),
        },
        {
          path: '/admin/analyze-analyze',
          name: 'analyze-analyze',
          meta: { title: '空间分析' },
          component: () => import('../pages/space/SpaceAnalyze.vue'),
        },

        //------------管理员页面--------------
        {
          path: '/admin/user-manager',
          name: 'user-manager',
          meta: { title: '用户管理' },
          component: () => import('../pages/admin/UserManager.vue'),
        },
        {
          path: '/admin/picture-manager',
          name: 'picture-manager',
          meta: { title: '图片管理' },
          component: () => import('../pages/admin/PictureManager.vue'),
        },
        {
          path: '/admin/analyze-manager',
          name: 'analyze-manager',
          meta: { title: '空间管理' },
          component: () => import('../pages/admin/SpaceManager.vue'),
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
