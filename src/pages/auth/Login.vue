<template>
  <n-card content-style="padding: 0;">
    <n-tabs
      type="line"
      size="large"
      :tabs-padding="20"
      pane-style="padding: 0px;"
      animated
      style="width: 100%"
    >
      <n-tab-pane name="登录">
        <div style="padding: 16px">
          <login-form />
        </div>
      </n-tab-pane>
      <n-tab-pane name="注册">
        <div style="padding: 16px">
          <register-form />
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import LoginForm from '@/pages/auth/components/LoginForm.vue'
import RegisterForm from '@/pages/auth/components/RegisterForm.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { watch } from 'vue'
//登录后需要跳转的 地址 通过路由获得
const props = defineProps<{ from?: string }>()
const router = useRouter()

const userStore = useLoginUserStore()

// 监听登录状态
watch(
  () => userStore.isLogin,
  () => {
    if (userStore.isLogin) {
      const from = props.from
      if (from) {
        router.replace(from)
      } else {
        router.replace('/')
      }
    }
  },
  { immediate: true },
)
</script>
