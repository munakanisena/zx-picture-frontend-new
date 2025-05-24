<template>
  <n-form ref="formRef" :model="formValue" :rules="rules" :show-require-mark="false" size="large">
    <n-form-item path="username" label="用户名">
      <n-input
        style="width: 100%"
        v-model:value="formValue.username"
        placeholder="请输入用户名"
      />
    </n-form-item>
    <n-form-item path="userEmail" label="邮箱">
      <n-input
        style="width: 100%"
        v-model:value="formValue.userEmail"
        placeholder="请输入邮箱"
      />
    </n-form-item>
    <n-text depth="3">*收不到验证邮件的话，记得看垃圾箱。</n-text>
    <n-form-item path="captcha" label="邮箱验证码" >
      <n-input
        style="width: 100%"
        v-model:value="formValue.captcha"
        placeholder="请输入邮箱验证码"
      />
      <n-button style="width: 120px;margin-left: 10px" :disabled="disabled" @click="sendCaptcha" type="primary" ghost attr-type="button">
        {{buttonText}}
      </n-button>
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input v-model:value="formValue.password"  show-password-on="click" type="password" placeholder="请输入密码" />
    </n-form-item>
    <n-form-item path="confirmPassword" label="重复密码">
      <n-input @keydown.enter="register()" v-model:value="formValue.confirmPassword"  show-password-on="click" type="password" placeholder="请重复输入密码" />
    </n-form-item>
    <div style="margin-bottom: 5px">
      <n-button attr-type="submit" type="primary" block secondary strong @click="register"> 注册</n-button>
    </div>
  </n-form>
</template>
<script lang="ts" setup>
import type { FormInst,FormItemRule } from 'naive-ui'
import { computed, onUnmounted, ref } from 'vue'
import { registerUsingPost, sendRegisterCaptchaUsingPost } from '@/api/userController.ts'
import { useRoute } from 'vue-router'

const route=useRoute()
const message=useMessage()
const formRef = ref<FormInst | null>(null)
//这里注意设置初始值 要不走不了表单校验
const formValue = ref<API.UserRegisterRequest>({
  username:'',
  userEmail:'',
  captcha:'',
  password:'',
  confirmPassword:'',
})

const emailRegex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const rules = {
  username:[
    {
      required: true,
      message: '用户名长度不能小于4位,大于16位',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> value.length>=4&&value.length<=16
    }
  ],
  userEmail:[
    {
      required: true,
      message: '邮箱格式错误',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> emailRegex.test(value)
    }
  ],
  captcha:[
    {
      required: true,
      message: '验证码长度为6位',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> value.length==6
    }
  ],
  password:[
    {
      required: true,
      message: '密码长度大于等于8',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> value.length>=8
    }
  ],
  confirmPassword:[
    {
      required: true,
      message:'两次密码不一致',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> value===formValue.value.password
    }
  ]
}
//验证码相关
const countdown = ref(0)
const timer = ref<number|null>(null)
const loadingBar=useLoadingBar()

// 计算属性：按钮是否禁用
const disabled = computed(() => countdown.value > 0)

// 计算属性：按钮显示文本
const buttonText = computed(() => {
  if (countdown.value > 0) {
    return `重新发送(${countdown.value}s)`
  }
  return '发送验证码'
})

const sendCaptcha=async ()=>{
  if (!emailRegex.test(formValue.value.userEmail as string)){
    message.error('邮箱格式错误')
    return
  }
  await sendRegisterCaptchaUsingPost({
    userEmail:formValue.value.userEmail
  })
  message.success('验证码已发送至您的邮箱，请查收')
  // 开始倒计时
  startCountdown()
}


const startCountdown = () => {
  countdown.value = 60

  // 根据环境使用正确的类型
  timer.value= setInterval(() => {
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

const register=async ()=>{
  try {
    await formRef.value?.validate()
  }catch (e){
    message.error('请检查输入')
    return
  }
  loadingBar.start()
    await registerUsingPost({
      ...formValue.value
    })
  message.success('注册成功')
  loadingBar.finish()
  //强制刷新 不使用路由跳转
  window.location.href = route.fullPath
}

</script>
<style scoped></style>
