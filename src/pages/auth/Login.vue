<template>
  <n-card>
    <n-image
      :src="logo"
      object-fit="cover"
      width="192px"
      preview-disabled
      style="display: flex; justify-content: center"
    />
    <n-tabs default-value="login" justify-content="space-evenly" type="line" size="large" animated>
      <n-tab-pane name="login" tab="登录">
          <login-form />
      </n-tab-pane>
      <n-tab-pane name="register" tab="注册">
          <register-form />
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
import logo from '@/image/logo.png'

const { from } = defineProps<{ from?: string }>()
const router = useRouter()
const userStore = useLoginUserStore()

// 监听登录状态
watch(
  () => userStore.isLogin,
  () => {
    if (userStore.isLogin) {
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
