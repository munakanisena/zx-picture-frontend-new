<template>
  <n-modal
    v-model:show="show"
    preset="card"
    title="编辑用户信息"
    :mask-closable="false"
    style="width: 500px"
  >
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="formValue.username" placeholder="请输入用户名" />
      </n-form-item>

      <n-form-item label="简介" path="userProfile">
        <n-input
          v-model:value="formValue.userProfile"
          type="textarea"
          placeholder="请输入个人简介"
        />
      </n-form-item>
<!--       目前没有手机号注册 / 以及手机号绑定-->
<!--      <n-form-item label="手机号" path="userPhone">-->
<!--        <n-input v-model:value="formValue.userPhone" placeholder="请输入手机号" />-->
<!--      </n-form-item>-->
      <n-form-item label="性别" path="userSex">
        <n-radio-group v-model:value="formValue.userSex">
          <n-space>
            <n-radio :value="0">男</n-radio>
            <n-radio :value="1">女</n-radio>
            <n-radio :value="2">保密</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="生日" path="birthday">
        <n-date-picker
          v-model:value="formValue.birthday"
          type="date"
          placeholder="选择生日"
          clearable
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button @click="closeModal">取消</n-button>
        <n-button type="primary" :loading="loading" @click="updateUser" > 保存 </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { type FormItemRule, useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { editUserInfoUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const props = defineProps<{
  userData?: API.LoginUserDetailVO
}>()
const show=ref(false)

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const userStore = useLoginUserStore()

const formValue = reactive<API.UserEditRequest>({
  id: undefined,
  username: '',
  userProfile: '',
  userPhone: '',
  userSex: undefined,
  birthday: '',
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '用户名长度不能小于4位,大于16位',
      trigger: ['blur', 'input'],
      validator:(rule: FormItemRule, value: string)=> value.length>=4&&value.length<=16
    },
  ],
}
const updateUser = async () => {
  try {
    await formRef.value?.validate()
  }catch (e){
    message.error('请检查输入')
    return
  }
  loading.value = true
  await editUserInfoUsingPost({
    ...formValue
  })
  await userStore.refreshUser()
  loading.value = false
  message.success('修改成功')
}

// 控制是否展示
const openModal=()=>{
  show.value=true
}
const closeModal = () => {
  show.value = false
}

//将show暴露给父组件
defineExpose({
  openModal
})

//传递用户信息
watch(
  () => props.userData,
  (newValue) => {
    if (newValue) {
      formValue.id = newValue.id
      formValue.username = newValue.username || ''
      formValue.userProfile = newValue.userProfile || ''
      formValue.userPhone = newValue.userPhone || ''
      formValue.userSex = newValue.userSex
      // 将日期字符串转换为时间戳
      formValue.birthday = newValue.birthday ? new Date(newValue.birthday).getTime() : undefined
    }
  },
  { immediate: true }
)

</script>
