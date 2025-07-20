<template>
  <n-card style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 16px">
    <div>
      <n-h2 style="margin-bottom: 16px">个人简介</n-h2>
      <n-p style="margin: 0">这是您的个人简介, 您的个人简介将会被显示在您的主页上</n-p>
    </div>
    <n-input
      v-model:value="introduction"
      :show-count="true"
      size="large"
      style="margin-top: 16px; border-radius: 12px"
      type="textarea"
      placeholder="请输入个人简介"
      :maxlength="120"
      clearable
    ></n-input>
    <n-flex justify="space-between" align="center" style="margin-top: 16px">
      <n-text depth="3">个人简介最大长度为 120, 可以是任意字符</n-text>
      <n-button ghost color=" #ff69b4" size="large" round @click="editIntroduction">保存</n-button>
    </n-flex>
  </n-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { editUserInfoUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const message = useMessage()

const introduction = ref<string>()
const editIntroduction = async () => {
  if (!introduction.value) {
    message.warning('请输入个人简介')
    return
  }
  await editUserInfoUsingPost({
    id: useLoginUserStore().userInfo.id,
    introduction: introduction.value,
  })
  await useLoginUserStore().refreshUser()
  message.success('修改成功')
  introduction.value = ''
}
</script>

<style scoped></style>
