<template>
  <n-card style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 16px">
    <div>
      <n-h2 style="margin-bottom: 16px">用户名</n-h2>
      <n-p style="margin: 0">这是您的用户名设置, 您的用户名是唯一的</n-p>
    </div>
    <n-input
      v-model:value="name"
      round
      :show-count="true"
      size="large"
      style="margin-top: 16px"
      type="text"
      placeholder="请输入用户名"
      :maxlength="16"
    ></n-input>
    <n-flex justify="space-between" align="center" style="margin-top: 16px">
      <n-text depth="3">用户名长度最大为 16, 可以是任意字符。</n-text>
      <n-button ghost color=" #ff69b4" size="large" round @click="editName">保存</n-button>
    </n-flex>
  </n-card>
</template>
<script setup lang="ts">
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { ref } from 'vue'
import { editUserInfoUsingPost } from '@/api/userController.ts'

const message = useMessage()
const name = ref<string>()

const editName = async () => {
  if (!name.value) {
    message.warning('用户名不能为空')
    return
  }
  await editUserInfoUsingPost({ id: useLoginUserStore().userInfo.id, name: name.value })
  await useLoginUserStore().refreshUser()
  message.success('修改成功')
  name.value = ''
}
</script>
<style scoped></style>
