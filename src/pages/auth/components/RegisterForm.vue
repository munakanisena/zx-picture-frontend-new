<template>
  <n-form
    ref="formRef"
    label-width="auto"
    :model="formValue"
    :rules="rules"
    :show-require-mark="false"
    size="medium"
    :show-label="false"
    style="max-width: 400px"
  >
    <n-form-item path="name">
      <n-input class="input-tall" v-model:value="formValue.name" placeholder="用户名" />
    </n-form-item>
    <n-form-item path="email">
      <n-input class="input-tall" v-model:value="formValue.email" placeholder="邮箱" />
    </n-form-item>
    <n-text depth="3">*收不到验证邮件的话，记得看垃圾箱。</n-text>
    <n-form-item path="captcha">
      <n-flex :wrap="false" style="width: 100%">
        <n-input class="input-tall" v-model:value="formValue.captcha" placeholder="验证码" />
        <n-button
          style="height: 48px; font-size: 16px"
          :disabled="disabled"
          @click="sendCaptcha"
          type="primary"
          ghost
          attr-type="button"
        >
          {{ buttonText }}
        </n-button>
      </n-flex>
    </n-form-item>
    <n-form-item path="password">
      <n-input
        class="input-tall"
        v-model:value="formValue.password"
        show-password-on="click"
        type="password"
        placeholder="密码"
      />
    </n-form-item>
    <n-form-item path="confirmPassword">
      <n-input
        class="input-tall"
        @keydown.enter="register()"
        v-model:value="formValue.confirmPassword"
        show-password-on="click"
        type="password"
        placeholder="重复密码"
      />
    </n-form-item>
    <div>
      <n-button
        style="height: 48px; font-size: 18px"
        attr-type="submit"
        type="primary"
        block
        strong
        @click="register"
      >
        注册
      </n-button>
    </div>
  </n-form>
</template>
<script lang="ts" setup>
import type { FormInst, FormItemRule } from 'naive-ui'
import { computed, onUnmounted, ref } from 'vue'
import { registerUsingPost, sendRegisterCaptchaUsingPost } from '@/api/userController.ts'
import { useRoute } from 'vue-router'

const route = useRoute()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
//这里注意设置初始值 要不走不了表单校验
const formValue = ref<API.UserRegisterRequest>({
  name: '',
  email: '',
  captcha: '',
  password: '',
  confirmPassword: '',
})

const emailRegex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const rules = {
  name: [
    {
      required: true,
      message: '用户名长度不能大于16位',
      trigger: ['blur', 'input'],
      validator: (rule: FormItemRule, value: string) => value.length <= 16,
    },
  ],
  email: [
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
  password: [
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
      validator: (rule: FormItemRule, value: string) => value === formValue.value.password,
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

const sendCaptcha = async () => {
  if (!emailRegex.test(formValue.value.email as string)) {
    message.error('邮箱格式错误')
    return
  }
  await sendRegisterCaptchaUsingPost({
    userEmail: formValue.value.email,
  })
  message.success('验证码已发送至您的邮箱，请查收')
  // 开始倒计时
  startCountdown()
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

const register = async () => {
  try {
    await formRef.value?.validate()
  } catch (e) {
    message.error('请检查输入')
    return
  }
  loadingBar.start()
  await registerUsingPost({
    ...formValue.value,
  })
  message.success('注册成功')
  loadingBar.finish()
  //强制刷新 不使用路由跳转
  window.location.href = route.fullPath
}
</script>
<style scoped>
.input-tall {
  height: 48px;
  line-height: 48px;
}
</style>
