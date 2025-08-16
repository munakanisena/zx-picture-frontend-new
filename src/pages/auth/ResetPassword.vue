<template>
  <n-card>
    <n-image
      :src="logo"
      object-fit="cover"
      width="192px"
      preview-disabled
      style="display: flex; justify-content: center"
    />
    <div
      style="
        font-weight: bold;
        font-size: 24px;
        display: flex;
        justify-content: center;
        margin-bottom: 12px;
      "
    >
      重置密码
    </div>
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      :show-label="false"
      :show-require-mark="false"
      size="large"
    >
      <n-form-item path="email">
        <n-input class="input-tall" v-model:value="formValue.email" placeholder="请输入邮箱" />
      </n-form-item>
      <n-text depth="3">*收不到验证邮件的话，记得看垃圾箱。</n-text>
      <n-form-item path="captcha">
        <n-flex :wrap="false" style="width: 100%">
          <n-input
            class="input-tall"
            v-model:value="formValue.captcha"
            placeholder="请输入邮箱验证码"
          />
          <n-button
            style="height: 48px; font-size: 16px"
            :disabled="disabled"
            @click="sendRestCaptcha"
            type="primary"
            ghost
            attr-type="button"
          >
            {{ buttonText }}
          </n-button>
        </n-flex>
      </n-form-item>
      <n-form-item path="newPassword">
        <n-input
          class="input-tall"
          v-model:value="formValue.newPassword"
          show-password-on="click"
          type="password"
          placeholder="请输入密码"
        />
      </n-form-item>
      <n-form-item path="confirmPassword">
        <n-input
          class="input-tall"
          v-model:value="formValue.confirmPassword"
          show-password-on="click"
          type="password"
          placeholder="请重复输入密码"
        />
      </n-form-item>
      <div>
        <n-button
          style="height: 48px; font-size: 18px"
          attr-type="submit"
          type="primary"
          block
          strong
          @click="restPassword"
        >
          重置密码
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>
<script lang="ts" setup>
import type { FormInst, FormItemRule } from 'naive-ui'
import { computed, onUnmounted, ref } from 'vue'
import logo from '@/image/logo.png'

import { forgotPasswordUsingPost, restPasswordUsingPost } from '@/api/userController.ts'

const message = useMessage()

const formRef = ref<FormInst | null>(null)
//这里注意设置初始值 要不走不了表单校验
const formValue = ref<API.UserResetPasswordRequest>({
  email: '',
  captcha: '',
  newPassword: '',
  confirmPassword: '',
})

const emailRegex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const rules = {
  userEmail: [
    {
      required: true,
      message: '邮箱格式错误',
      trigger: ['blur', 'input'],
      validator: (rule: FormItemRule, value: string) => emailRegex.test(value),
    },
  ],
  captcha: [
    {
      required: true,
      message: '验证码长度为6位',
      trigger: ['blur', 'input'],
      validator: (rule: FormItemRule, value: string) => value.length == 6,
    },
  ],
  newPassword: [
    {
      required: true,
      message: '密码长度大于等于8',
      trigger: ['blur', 'input'],
      validator: (rule: FormItemRule, value: string) => value.length >= 8,
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: '两次密码不一致',
      trigger: ['blur', 'input'],
      validator: (rule: FormItemRule, value: string) => value === formValue.value.newPassword,
    },
  ],
}

//验证码相关
const countdown = ref(0)
const timer = ref<number | null>(null)
const loadingBar = useLoadingBar()

// 计算属性：按钮是否禁用
const disabled = computed(() => countdown.value > 0)

// 计算属性：按钮显示文本
const buttonText = computed(() => {
  if (countdown.value > 0) {
    return `重新发送(${countdown.value}s)`
  }
  return '发送验证码'
})

const sendRestCaptcha = async () => {
  if (!emailRegex.test(formValue.value.email as string)) {
    message.error('邮箱格式错误')
    return
  }
  // 开始倒计时
  startCountdown()
  await forgotPasswordUsingPost({
    userEmail: formValue.value.email,
  })
  message.success('验证码已发送至您的邮箱，请查收')
}

const startCountdown = () => {
  countdown.value = 60

  // 根据环境使用正确的类型
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value as number)
    }
  }, 1000)
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

const restPassword = async () => {
  try {
    await formRef.value?.validate()
  } catch (e) {
    message.error('请检查输入')
    return
  }
  loadingBar.start()
  await restPasswordUsingPost({
    ...formValue.value,
  })
  message.success('重置成功')
  loadingBar.finish()
}
</script>
<style scoped>
.input-tall {
  height: 48px;
  line-height: 48px;
}
</style>
