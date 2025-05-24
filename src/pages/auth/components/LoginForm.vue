<template>
<n-card content-style="padding: 0;">
  <n-form ref="formRef" :model="formValue" :rules="rules" :show-require-mark="false" size="large" >
    <n-form-item path="emailOrUsername" label="账号">
      <n-input
        style="width: 100%"
        v-model:value="formValue.emailOrUsername"
        placeholder="请输入账户名/邮箱"
      />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input @keydown.enter="login()" v-model:value="formValue.password"  show-password-on="click" type="password" placeholder="请输入密码" />
    </n-form-item>
    <router-link :to="{name:'rest-password'}" style="text-decoration: none;"><n-a>忘记密码</n-a></router-link>
    <div style="margin-bottom: 5px;margin-top: 5px">
      <n-button  type="primary" block secondary strong @click="login"> 登录 </n-button>
    </div>
  </n-form>
</n-card>
</template>
<script lang="ts" setup>
import type { FormInst,FormItemRule } from 'naive-ui'
import { ref } from 'vue'
import { loginUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const message=useMessage()
//加载进度条
const loadingBar = useLoadingBar();

const formRef = ref<FormInst | null>(null)
//这里注意设置初始值 要不走不了表单校验
const formValue = ref<API.UserLoginRequest>({
  emailOrUsername:'',
  password:''
})

const rules = {
  emailOrUsername:[
    {
      required: true,
      message: '邮箱/用户名不能为空',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> value.length>0
    }
  ],
  password:[
    {
      required: true,
      message: '密码长度大于等于8',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> value.length>=8
    }
  ]
}

const login=async ()=>{
  try {
   await formRef.value?.validate()
  }catch (e){
    message.error('请检查输入')
    return
  }
    loadingBar.start()
    const {data}= await loginUsingPost(formValue.value)
    useLoginUserStore().setLoginUser(data)
    message.success('登录成功')
    loadingBar.finish()
}

</script>
<style scoped></style>
