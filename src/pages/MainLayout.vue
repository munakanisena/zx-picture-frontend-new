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
          <n-image preview-disabled alt="logo" :src="logo" height="64px" />
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

    <!--侧边栏-->
    <n-layout :has-sider="hasSider" position="absolute" style="top: 64px; bottom: 48px">
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

      <!--页面内容-->
      <n-layout-content>
        <router-view v-slot="{ Component }">
          <keep-alive
            :include="['home', 'user-profile', 'picture-collect', 'space-person', 'space-team']"
          >
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </n-layout-content>
    </n-layout>

    <!--移动端侧边栏-->
    <BDrawerLeft v-if="!hasSider" v-model:show="showMenuDrawer">
      <n-menu :value="menuKey" :options="menuOptions" />
    </BDrawerLeft>

    <!--页脚-->
    <n-layout-footer position="absolute" style="height: 48px" bordered>
      <n-flex justify="center" align="center" style="width: 100%; height: 100%">
        <span>© 2025 划船听水声</span>
        <n-divider vertical style="height: 12px; margin: 0 12px" />
        <n-a
          href="https://beian.miit.gov.cn"
          target="_blank"
          style="text-decoration: none; color: #999"
        >
          湘ICP备2024089321号-2
        </n-a>
      </n-flex>
    </n-layout-footer>
  </n-layout>
</template>
<script lang="ts" setup>
import type { Component } from 'vue'
import logo from "@/image/logo.png"
import { computed, h, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import type { MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import {
  AddCircleOutline as JoinIcon,
  BookmarkOutline as FavoriteIcon,
  BugOutline as BugIcon,
  CloudUploadOutline as UploadIcon,
  GridOutline as SpaceIcon,
  HomeOutline as HomeIcon,
  ImagesOutline as ImageIcon,
  LibraryOutline as BlogsIcon,
  LogoGithub as GithubIcon,
  LogOutOutline as LogoutIcon,
  MenuOutline as MenuIcon,
  NewspaperOutline as AdminIcon,
  PeopleOutline as TeamIcon,
  PersonOutline as UserIcon,
  SettingsOutline as SettingIcon,
  TimeOutline as TimeIcon,
} from '@vicons/ionicons5'

import router from '@/router/router.ts'

import { useBreakPoints } from '@/utils/util.ts'
import BDrawerLeft from '@/components/BDrawerLeft.vue'
import { storeToRefs } from 'pinia'
import { USER_ROLE_ENUM } from '@/constants/user.ts'

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
  return route.path
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
          key: '/picture-upload',
          label: renderLabel('上传图片', '/picture-upload'),
          icon: renderIcon(UploadIcon),
        },
        {
          key: '/picture-capture',
          label: renderLabel('抓取图片', '/picture-capture'),
          icon: renderIcon(BugIcon),
        },
        {
          key: '/user-edit',
          label: renderLabel('用户设置', `/user-edit`),
          icon: renderIcon(SettingIcon),
        },
        {
          key: '/picture-collect',
          label: renderLabel('用户收藏', '/picture-collect'),
          icon: renderIcon(FavoriteIcon),
        },
      ],
    },
    {
      key: '/space',
      label: '空间',
      icon: renderIcon(SpaceIcon),
      show: userStore.isLogin,
      children: [
        {
          key: '/space/person',
          label: renderLabel('用户空间', '/space/person'),
          icon: renderIcon(SpaceIcon),
        },
        {
          key: '/space/team/join',
          label: renderLabel('加入空间', '/space/team/join'),
          icon: renderIcon(JoinIcon),
        },
        {
          key: '/space/team',
          label: renderLabel('团队空间', '/space/team'),
          icon: renderIcon(TeamIcon),
        },
      ],
    },
    {
      key: '/admin',
      label: '管理',
      icon: renderIcon(AdminIcon),
      show: userInfo?.value.role === USER_ROLE_ENUM.ADMIN,
      children: [
        {
          key: '/admin/user-manager',
          label: renderLabel('用户管理', '/admin/user-manager'),
          icon: renderIcon(AdminIcon),
        },
        {
          key: '/admin/picture-manager',
          label: renderLabel('图片管理', '/admin/picture-manager'),
          icon: renderIcon(ImageIcon),
        },
        {
          key: '/admin/analyze-manager',
          label: renderLabel('空间管理', '/admin/analyze-manager'),
          icon: renderIcon(SpaceIcon),
        },
      ],
    },
    {
      key: 'divider',
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

<style scoped></style>
