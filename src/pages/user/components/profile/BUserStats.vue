<template>
  <n-grid cols="2" style="margin: 12px 0" x-gap="24">
    <n-gi span="1">
      <n-card
        :bordered="false"
        style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
        hoverable
      >
        <n-icon :component="UploadIcon" :size="48" color="#1890ff"></n-icon>
        <n-statistic
          style="margin-left: 16px"
          label="上传"
          :value="userStats?.uploadCount"
        ></n-statistic>
      </n-card>
    </n-gi>
    <n-gi span="1">
      <n-card
        :bordered="false"
        style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
        hoverable
      >
        <n-icon :component="StarIcon" :size="48" color="#1890ff"></n-icon>
        <n-statistic
          style="margin-left: 16px"
          label="收藏"
          :value="userStats?.collectCount"
        ></n-statistic>
      </n-card>
    </n-gi>
  </n-grid>
</template>
<script setup lang="ts">
import { CloudUploadOutline as UploadIcon, StarOutline as StarIcon } from '@vicons/ionicons5'
import { onMounted, ref } from 'vue'
import { getUserPictureStatsUsingGet } from '@/api/pictureController.ts'

const userStats = ref<API.UserPictureStatsVO>()

const fetchUserStats = async () => {
  const { data } = await getUserPictureStatsUsingGet()
  userStats.value = data ?? { collectCount: 0, uploadCount: 0 }
}

onMounted(() => {
  fetchUserStats()
})
</script>
<style scoped></style>
