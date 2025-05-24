<template>
  <n-layout :has-sider="hasSider" style="min-height: 100vh; width: 100%">
    <n-layout-header bordered style="position: fixed; z-index: 2">
      <n-flex align="center" style="height: 50px" :size="0">
        <!--当宽度不够时-->
        <n-button
          v-if="!hasSider"
          size="large"
          quaternary
          circle
          :focusable="false"
          style="margin: 0 8px"
          @click="showMenuDrawer = true"
        >
          <n-icon size="24" :component="MenuIcon" />
        </n-button>
        <div v-else style="padding: 0 16px; width: 100px">
          <img alt="logo" src="/src/image/logo.png" />
        </div>

        <div style="flex: 1"></div>

        <div style="margin-top: 5px; margin-right: 16px">
          <n-dropdown
            v-if="userState.isLogin"
            :options="userDropdownOptions"
            trigger="hover"
            :keyboard="false"
            @select="handleUserDropdownSelect"
          >
            <n-button size="large" :focusable="false" quaternary>{{
              userInfo?.username
            }}</n-button>
          </n-dropdown>
          <router-link v-else :to="{ name: 'login', query: { from: route.fullPath } }">
            <n-button size="large">登录/注册</n-button>
          </router-link>
        </div>
      </n-flex>
    </n-layout-header>

    <!-- 展开时按钮的位置 -->
    <n-layout-sider
      v-if="hasSider"
      :show-trigger="menuShowTrigger"
      :trigger-style="{ position: 'fixed', top: '80%', left: '214px' }"
      :collapsed-trigger-style="{ position: 'fixed', top: '80%', left: '36px' }"
      bordered
      :width="240"
      :collapsed="menuCollapsed"
      :collapsed-width="64"
      collapse-mode="width"
      :native-scrollbar="false"
      style="z-index: 1"
      @collapse="menuSetting = true"
      @expand="menuSetting = false"
    >
      <!--自定义滚轮条-->
      <n-scrollbar
        style="margin-top: 50px; position: fixed; top: 0"
        :style="{ width: menuCollapsed ? '64px' : '240px' }"
      >
        <n-menu
          :value="menuKey"
          :options="menuOptions"
          :width="240"
          :collapsed="menuCollapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          style="margin-bottom: 64px"
        />
      </n-scrollbar>
    </n-layout-sider>

    <n-layout-content
      style="margin-top: 50px; margin-bottom: 64px; z-index: 0; min-height: calc(100vh - 50px)"
    >
      <router-view v-slot="{ Component }">
        <keep-alive :include="[]">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </n-layout-content>

    <!--手机尺寸侧边栏-->
    <b-phone-drawer
      v-if="!hasSider"
      v-model:show="showMenuDrawer"
      :username="userInfo?.username"
      :user-avatar="userInfo?.userAvatar"
    >
      <n-menu :value="menuKey" :options="menuOptions" />
    </b-phone-drawer>
  </n-layout>
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  HomeOutline as HomeIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
  MenuOutline as MenuIcon,
  TimeOutline as TimeIcon,
  LibraryOutline as BlogsIcon,
  LogoGithub as GithubIcon,
  NewspaperOutline as AdminIcon
} from '@vicons/ionicons5'
import {
  FavoriteBorderFilled as FavoriteIcon,
  SpaceDashboardRound as SpaceIcon,
} from '@vicons/material'

import router from '@/router/router.ts'

import { useBreakPoints } from '@/pages/util.ts'
import BPhoneDrawer from '@/components/BPhoneDrawer.vue'

const bp = useBreakPoints()
//大于等于 侧边栏存在
const hasSider = bp.greater('tablet')
const menuShowTrigger = bp.greater('desktop')
const showMenuDrawer = ref(false)

//存在侧边栏 收起手机侧边栏
watch(hasSider, () => (showMenuDrawer.value = false))

const route = useRoute()

const userState = useLoginUserStore().userState
//随改变 变化
const userInfo = computed(() => userState.uerInfo)

const menuSetting = ref(false)

//注意 计算属性只能读 不能写 所以需要让menuC依赖一个额外的变量
const menuCollapsed = computed(() => {
  if (menuShowTrigger.value) {
    return menuSetting.value
  }
  return true
})

const renderLabel = (text: string, href: string) => () =>
  h(RouterLink, { to: href }, { default: () => text })

const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })

//用户下拉菜单
const userDropdownOptions = [
  {
    label: '用户资料',
    key: 'user-profile',
    icon: renderIcon(UserIcon),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutIcon),
  },
]

const handleUserDropdownSelect = async (key: string | number) => {
  if (key === 'logout') {
    await useLoginUserStore().logout()
  }
  if (key === 'user-profile') {
    await router.replace('/user-profile')
  }
}

//侧边栏选中
const menuKey = computed(() => {
  const path = route.path
  for (const key of ['/favorite', '/space', '/user-profile']) {
    if (path.startsWith(key)) {
      return key
    }
    return path
  }
})

//侧边栏菜单 动态
const menuOptions = computed<MenuOption[]>(() => {
  //todo 过于繁琐 考虑修改
  if (!userState.isLogin){
    return [
      {
        key: '/',
        label: renderLabel('首页', '/'),
        icon: renderIcon(HomeIcon),
      },
      {
        key: '/timeline',
        label: renderLabel('开发历程', '/timeline'),
        icon: renderIcon(TimeIcon),
      },
      {
        key: '/blogs',
        label:()=>
          h(
            'a',
            {
              href: 'https://katomugumi.com/',
              target: '_blank',
              rel: '个人博客'
            },
            '个人博客'
          ),
        icon: renderIcon(BlogsIcon),

      },
      {
        key: '/github',
        label:()=>
          h(
            'a',
            {
              href: 'https://github.com/munakanisena/zx-picture-frontend-new',
              target: '_blank',
              rel: '项目仓库'
            },
            '项目仓库'
          ),
        icon: renderIcon(GithubIcon),
      },
      ]
  }
  if (userInfo.value.userRole==='admin'){
    return [
      {
        key: '/',
        label: renderLabel('首页', '/'),
        icon: renderIcon(HomeIcon),
      },
      {
        key: '/user',
        label: '用户',
        icon: renderIcon(UserIcon),
        children: [
          {
            key: '/user-profile',
            label: renderLabel('用户资料', '/user-profile'),
            icon: renderIcon(UserIcon),
          },
          {
            key: '/favorite',
            label: renderLabel('用户收藏', '/favorite'),
            icon: renderIcon(FavoriteIcon),
          },
          {
            key: '/space',
            label: renderLabel('用户空间', '/space'),
            icon: renderIcon(SpaceIcon),
          },
        ],
      },
      {
        key: '/admin',
        label: '管理',
        icon: renderIcon(AdminIcon),
        children: [
          {
            key: '/admin/user-manager',
            label: renderLabel('用户管理', '/admin/user-manager'),
            icon: renderIcon(AdminIcon),
          }
        ]
      },
      {
        key: 'divider-1',
        type: 'divider',
        props: {
          style: {
            marginLeft: '32px',
          },
        },
      },
      {
        key: '/timeline',
        label: renderLabel('开发历程', '/timeline'),
        icon: renderIcon(TimeIcon),
      },
      {
        key: '/blogs',
        label:()=>
          h(
            'a',
            {
              href: 'https://katomugumi.com/',
              target: '_blank',
              rel: '个人博客'
            },
            '个人博客'
          ),
        icon: renderIcon(BlogsIcon),

      },
      {
        key: '/github',
        label:()=>
          h(
            'a',
            {
              href: 'https://github.com/munakanisena/zx-picture-frontend-new',
              target: '_blank',
              rel: '项目仓库'
            },
            '项目仓库'
          ),
        icon: renderIcon(GithubIcon),
      },
    ]
  }
  return [
    {
      key: '/',
      label: renderLabel('首页', '/'),
      icon: renderIcon(HomeIcon),
    },
    {
      key: '/user',
      label: '用户',
      icon: renderIcon(UserIcon),
      children: [
        {
          key: '/user-profile',
          label: renderLabel('用户资料', '/user-profile'),
          icon: renderIcon(UserIcon),
        },
        {
          key: '/favorite',
          label: renderLabel('用户收藏', '/favorite'),
          icon: renderIcon(FavoriteIcon),
        },
        {
          key: '/space',
          label: renderLabel('用户空间', '/space'),
          icon: renderIcon(SpaceIcon),
        },
      ],
    },
    {
      key: 'divider-1',
      type: 'divider',
      props: {
        style: {
          marginLeft: '32px',
        },
      },
    },
    {
      key: '/timeline',
      label: renderLabel('开发历程', '/timeline'),
      icon: renderIcon(TimeIcon),
    },
    {
      key: '/blogs',
      label:()=>
        h(
        'a',
        {
          href: 'https://katomugumi.com/',
          target: '_blank',
          rel: '个人博客'
        },
        '个人博客'
      ),
      icon: renderIcon(BlogsIcon),

    },
    {
      key: '/github',
      label:()=>
        h(
          'a',
          {
            href: 'https://github.com/munakanisena/zx-picture-frontend-new',
            target: '_blank',
            rel: '项目仓库'
          },
          '项目仓库'
        ),
      icon: renderIcon(GithubIcon),
    },
  ]
})

//避免手机打开新页面 每次都展开 菜单
watch(
  () => route.path,
  () => (showMenuDrawer.value = false),
)
</script>

<style scoped>
.layout-content {
  width: 100%;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

@media only screen and (max-width: 600px) {
  .layout-content {
    margin-right: 12px;
    margin-left: 12px;
  }
}
</style>
