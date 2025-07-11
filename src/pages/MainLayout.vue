<template>
  <n-layout style="min-height: 100vh; width: 100%">
    <n-layout-header bordered style="position: fixed; z-index: 2">
      <n-flex align="center" style="height: 64px" :size="0">
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
        <div v-else style="padding: 0 16px; margin-left: 10px; max-width: 200px">
          <img alt="logo" src="/src/image/logo.png" />
        </div>

        <div style="flex: 1"></div>

        <div style="margin-right: 16px">
          <n-dropdown
            v-if="useLoginUserStore().isLogin"
            :options="userDropdownOptions"
            trigger="hover"
            :keyboard="false"
            @select="handleUserDropdownSelect"
          >
            <n-button size="large" :focusable="false" quaternary>{{ userInfo?.name }}</n-button>
          </n-dropdown>
          <router-link v-else :to="{ name: 'login', query: { from: route.fullPath } }">
            <n-button size="large">登录/注册</n-button>
          </router-link>
        </div>
      </n-flex>
    </n-layout-header>

    <n-layout :has-sider="hasSider" position="absolute" style="top: 64px; bottom: 64px">
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
        <n-menu
          :value="menuKey"
          :options="menuOptions"
          :width="240"
          :collapsed="menuCollapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
        />
      </n-layout-sider>

      <n-layout-content>
        <router-view v-slot="{ Component }">
          <keep-alive :include="['profile']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </n-layout-content>
    </n-layout>

    <!--移动端侧边栏-->
    <BPhoneDrawer
      v-if="!hasSider"
      v-model:show="showMenuDrawer"
      :username="userInfo?.name"
      :user-avatar="userInfo?.avatar"
    >
      <n-menu :value="menuKey" :options="menuOptions" style="width: 100%" />
    </BPhoneDrawer>

    <n-layout-footer position="absolute" style="height: 64px; padding: 24px" bordered>
      Footer Footer Footer
    </n-layout-footer>
  </n-layout>
</template>
<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, h, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import type { MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import {
  CloudUploadOutline as UploadIcon,
  GridOutline as SpaceIcon,
  HomeOutline as HomeIcon,
  LibraryOutline as BlogsIcon,
  LogoGithub as GithubIcon,
  LogOutOutline as LogoutIcon,
  MenuOutline as MenuIcon,
  NewspaperOutline as AdminIcon,
  PersonOutline as UserIcon,
  SettingsOutline as SettingIcon,
  BookmarkOutline as FavoriteIcon,
  TimeOutline as TimeIcon,
} from '@vicons/ionicons5'

import router from '@/router/router.ts'

import { useBreakPoints } from '@/utils/util.ts'
import BPhoneDrawer from '@/components/BPhoneDrawer.vue'
import { storeToRefs } from 'pinia'

const bp = useBreakPoints()
//大于等于 侧边栏存在
const hasSider = bp.greater('tablet')
const menuShowTrigger = bp.greater('desktop')
const showMenuDrawer = ref(false)

//存在侧边栏 收起手机侧边栏
watch(hasSider, () => (showMenuDrawer.value = false))

const route = useRoute()

const userStore = useLoginUserStore()
const { userInfo } = storeToRefs(userStore)

const menuSetting = ref(false)

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
      show: userStore.isLogin,
      children: [
        {
          key: '/user-profile',
          label: renderLabel('用户资料', '/user-profile'),
          icon: renderIcon(UserIcon),
        },
        {
          key: '/user/picture-upload',
          label: renderLabel('上传图片', '/user/picture-upload'),
          icon: renderIcon(UploadIcon),
        },
        {
          key: `/user-edit/${userInfo.value.id}`,
          label: renderLabel('用户设置', `/user-edit/${userInfo.value.id}`),
          icon: renderIcon(SettingIcon),
        },
        {
          key: '/favorite',
          label: renderLabel('用户收藏', '/favorite'),
          icon: renderIcon(FavoriteIcon),
        },
        {
          key: '/space/person',
          label: renderLabel('用户空间', '/space/person'),
          icon: renderIcon(SpaceIcon),
        },
      ],
    },
    {
      key: '/admin',
      label: '管理',
      icon: renderIcon(AdminIcon),
      show: userInfo?.value.role === 'admin',
      children: [
        {
          key: '/admin/user-manager',
          label: renderLabel('用户管理', '/admin/user-manager'),
          icon: renderIcon(AdminIcon),
        },
      ],
    },
    {
      key: 'divider-1',
      type: 'divider',
    },
    {
      key: '/timeline',
      label: renderLabel('开发历程', '/timeline'),
      icon: renderIcon(TimeIcon),
    },
    {
      key: '/blogs',
      label: () =>
        h(
          'a',
          {
            href: 'https://katomegumi.site/',
            target: '_blank',
            rel: '个人博客',
          },
          '个人博客',
        ),
      icon: renderIcon(BlogsIcon),
    },
    {
      key: '/github',
      label: () =>
        h(
          'a',
          {
            href: 'https://github.com/munakanisena/zx-picture-frontend-new',
            target: '_blank',
            rel: '项目仓库',
          },
          '项目仓库',
        ),
      icon: renderIcon(GithubIcon),
    },
  ]
})

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
