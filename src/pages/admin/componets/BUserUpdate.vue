<template>
  <n-modal v-model:show="show" preset="dialog" title="编辑用户">
    <n-form :model="formValue">
      <n-form-item label="用户名" prop="username">
        <n-input v-model:value="formValue.name" />
      </n-form-item>
      <n-form-item label="用户角色" prop="userRole">
        <n-select v-model:value="formValue.role" :options="toOptions(USER_ROLE_MAP)" />
      </n-form-item>
      <n-form-item label="会员状态" prop="isVip">
        <n-select
          v-model:value="USER_VIP_MAP[formValue.isDisabled as number]"
          :options="toOptions(USER_VIP_MAP)"
        />
      </n-form-item>
      <n-form-item label="账号状态" prop="isDisabled">
        <n-select
          v-model:value="USER_STATE_MAP[formValue.isDisabled as number]"
          :options="toOptions(USER_STATE_MAP)"
        />
      </n-form-item>
    </n-form>
    <n-space>
      <n-button @click="closeUpdateModal">取消</n-button>
      <n-button type="primary" @click="userUpdate">保存</n-button>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { defineExpose, reactive, ref } from 'vue'
import { NButton, NForm, NFormItem, NInput, NModal, NSelect, useMessage } from 'naive-ui'
import { updateUserUsingPost } from '@/api/userController'
import { toOptions } from '@/utils/util.ts'
import { USER_ROLE_MAP, USER_STATE_MAP, USER_VIP_MAP } from '@/constants/user.ts'

const message = useMessage()
const show = ref(false)

const props = defineProps(['currentUser', 'refresh'])

// 表单数据
const formValue = reactive<API.UserUpdateRequest>({
  ...props.currentUser,
})

const userUpdate = async () => {
  await updateUserUsingPost(formValue)
  message.success('用户信息更新成功')
  closeUpdateModal()
  props.refresh()
}

const openUpdateModal = () => {
  show.value = true
}

const closeUpdateModal = () => {
  show.value = false
}

//可以将函数暴露给父组件
defineExpose({
  openUpdateModal,
})
</script>
