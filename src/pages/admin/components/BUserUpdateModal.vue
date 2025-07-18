<template>
  <n-modal v-model:show="show" preset="card" title="编辑用户" style="width: 600px">
    <n-form :model="formValue" label-placement="left" label-width="80">
      <n-form-item label="用户名">
        <n-input v-model:value="formValue.name" />
      </n-form-item>
      <n-form-item label="用户角色" path="role">
        <n-select v-model:value="formValue.role" :options="toOptions(USER_ROLE_MAP)" />
      </n-form-item>
      <n-form-item label="会员状态" path="isVip">
        <n-switch checked-value="1" unchecked-value="0" v-model:value="formValue.isVip">
          <template #checked>是</template>
          <template #unchecked>否</template>
        </n-switch>
      </n-form-item>
      <n-form-item label="账号状态" path="isDisabled">
        <n-switch checked-value="1" unchecked-value="0" v-model:value="formValue.isDisabled">
          <template #checked>禁用</template>
          <template #unchecked>启用</template>
        </n-switch>
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button @click="closeUpdateModal">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleUserUpdate">保存</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { updateUserUsingPost } from '@/api/userController'
import { toOptions } from '@/utils/util.ts'
import { USER_ROLE_MAP } from '@/constants/user.ts'

const message = useMessage()
const show = ref(false)
const loading = ref(false)

const props = defineProps<{
  currentUser: API.UserVO
  refresh: () => void
}>()

// 表单数据
const formValue = ref<API.UserUpdateRequest>({})

//todo 编辑延迟
watch(
  () => props.currentUser,
  (newUser) => {
    formValue.value = { ...newUser }
  },
  { immediate: true },
)

const openUpdateModal = () => {
  show.value = true
}

const closeUpdateModal = () => {
  show.value = false
}

const handleUserUpdate = async () => {
  try {
    loading.value = true
    await updateUserUsingPost({
      ...formValue.value,
    })
    message.success('用户信息更新成功')
    closeUpdateModal()
    props.refresh()
  } finally {
    loading.value = false
  }
}

defineExpose({
  openUpdateModal,
})
</script>
