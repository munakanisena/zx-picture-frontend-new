<template>
  <n-card title="作者信息">
    <n-flex align="center">
      <n-avatar size="large" round :src="pictureDetail?.userAvatar"></n-avatar>
      {{ pictureDetail?.userName }}
    </n-flex>
  </n-card>
</template>
<script setup lang="ts">
const { pictureDetail } = defineProps<{
  pictureDetail?: API.PictureDetailVO
}>()
</script>
<style scoped></style>
