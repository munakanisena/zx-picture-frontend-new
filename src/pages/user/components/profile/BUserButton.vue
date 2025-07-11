<template>
  <div style="width: 100%">
    <n-flex :vertical="true">
      <n-button
        round
        color="#5f5f5f"
        size="large"
        type="primary"
        @click="handleEdit"
        :render-icon="renderIcon(EditIcon)"
      >
        编辑信息
      </n-button>
      <n-button
        round
        size="large"
        color="#FA58F4"
        @click="handleUpload"
        :render-icon="renderIcon(UploadIcon)"
      >
        上传图片
      </n-button>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { PencilOutline as EditIcon, CheckmarkOutline as UploadIcon } from '@vicons/ionicons5'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const userStore = useLoginUserStore()

const router = useRouter()
const handleEdit = () => {
  router.push({ name: 'user-edit', params: { id: userStore.userInfo.id } })
}

//todo上传图片页面还没做好
const handleUpload = () => {}

const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })
</script>

<style scoped></style>
