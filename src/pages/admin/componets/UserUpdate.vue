<template>
  <n-modal v-model:show="show" preset="dialog" title="编辑用户">
    <n-form :model="formValue" :rules="rules">
      <n-form-item label="用户名" prop="username">
        <n-input v-model:value="formValue.username" />
      </n-form-item>
      <n-form-item label="用户角色" prop="userRole">
        <n-select v-model:value="formValue.userRole" :options="userRoleOptions" />
      </n-form-item>
      <n-form-item label="会员状态" prop="isVip">
        <n-select v-model:value="formValue.isVip" :options="vipOptions" />
      </n-form-item>
      <n-form-item label="账号状态" prop="isDisabled">
        <n-select v-model:value="formValue.isDisabled" :options="isDisabledOptions" />
      </n-form-item>
    </n-form>
    <n-space>
      <n-button @click="closeModal">取消</n-button>
      <n-button type="primary" @click="userUpdate">保存</n-button>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineExpose } from 'vue'
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  type FormRules,
  useMessage,
  type FormItemRule,
} from 'naive-ui'
import { updateUserUsingPost } from '@/api/userController'

const message = useMessage()
const props = defineProps<{
  userData?: API.UserVO,
  refresh?:()=> void
}>()
const show = ref(false)

// 表单数据
const formValue = reactive<API.UserUpdateRequest>({
  id: undefined,
  username: '',
  userRole: '',
  isVip: 0,
  isDisabled: 0,
})

// 用户角色选项
const userRoleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
]

// 会员状态选项
const vipOptions = [
  { label: '普通用户', value: 0 },
  { label: '会员用户', value: 1 },
]

// 账号状态选项
const isDisabledOptions = [
  { label: '正常', value: 0 },
  { label: '已禁用', value: 1 },
]

// 表单验证规则
const rules: FormRules = {
  username: [
    {
      required: true,
      message: '用户名长度不能小于4位,大于16位',
      trigger: ['blur', 'input'],
      validator: (rule: FormItemRule, value: string) => value.length >= 4 && value.length <= 16,
    },
  ],
}

// 监听用户数据变化
watch(
  () => props.userData,
  (newVal) => {
    if (newVal) {
      Object.assign(formValue, newVal)
    }
  },
  { immediate: true },
)

// 提交表单
const userUpdate = async () => {
  await updateUserUsingPost(formValue)
  message.success('用户信息更新成功')
  await props.refresh()
}

// 打开上传模态框
const openModal = () => {
  show.value = true
}

//关闭模态框
const closeModal = () => {
  show.value = false
}

//可以将函数暴露给父组件
defineExpose({
  openModal,
})
</script>
