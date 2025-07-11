<template>
  <n-grid cols="2" style="margin: 12px 0" x-gap="24">
    <n-grid-item v-for="item in stats" :key="item.label">
      <n-card
        :bordered="false"
        style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
        hoverable
      >
        <n-flex align="center">
          <n-icon :component="item.icon" :size="48" color="#1890ff"></n-icon>
          <n-statistic
            style="margin-left: 16px"
            :label="item.label"
            :value="item.value"
          ></n-statistic>
        </n-flex>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>
<script setup lang="ts">
import { CloudUploadOutline as UploadIcon, StarOutline as StarIcon } from '@vicons/ionicons5'
import { ref } from 'vue'

const props = defineProps({})

//todo 真实数据
const stats = ref([
  { label: '上传', value: 1, icon: UploadIcon },
  { label: '收藏', value: 2, icon: StarIcon },
])
</script>
<style scoped></style>
