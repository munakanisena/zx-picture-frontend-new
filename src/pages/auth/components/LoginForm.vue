<template>
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="rules"
    :show-require-mark="false"
    :show-label="false"
    size="large"
  >
    <n-form-item path="emailOrUsername">
      <n-input
        class="input-tall"
        v-model:value="formValue.emailOrUsername"
        placeholder="账户名或邮箱"
      />
    </n-form-item>
    <n-form-item path="password">
      <n-input
        class="input-tall"
        @keydown.enter="login()"
        v-model:value="formValue.password"
        show-password-on="click"
        type="password"
        placeholder="密码"
      />
    </n-form-item>
  </n-form>
  <router-link :to="{ name: 'rest-password' }" style="text-decoration: none">
    <n-a style="font-weight: bolder; display: flex; justify-content: end">忘记密码</n-a>
  </router-link>
  <div style="height: 8px"></div>
  <n-button
    style="height: 48px; font-size: 18px"
    attr-type="submit"
    type="primary"
    block
    strong
    @click="login"
  >
    登录
  </n-button>
</template>
<script lang="ts" setup>
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { ref } from 'vue'
import { loginUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const message = useMessage()
const loadingBar = useLoadingBar()
const formRef = ref<FormInst | null>(null)
const formValue = ref<API.UserLoginRequest>({
  emailOrUsername: '',
  password: '',
})

const rules: FormRules = {
  emailOrUsername: [
    {
      required: true,
      message: '邮箱/用户名不能为空',
      trigger: ['blur', 'input'],
      validator: (_rule: FormItemRule, value: string) => value.length > 0,
    },
  ],
  password: [
    {
      required: true,
      message: '密码长度大于等于8',
      trigger: ['blur', 'input'],
      validator: (_rule: FormItemRule, value: string) => value.length >= 8,
    },
  ],
}

const login = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  loadingBar.start()
  const { data } = await loginUsingPost(formValue.value)
  useLoginUserStore().setLoginUser(data)
  message.success('登录成功')
  loadingBar.finish()
}
</script>
<style scoped>
.input-tall {
  height: 48px;
  line-height: 48px;
}
</style>
