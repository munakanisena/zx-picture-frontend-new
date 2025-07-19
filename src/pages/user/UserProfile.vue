<template>
  <n-grid
    x-gap="12"
    responsive="screen"
    y-gap="12"
    style="height: 100%; margin: 0 auto"
    item-responsive
  >
    <n-gi span="24 l:8 " style="margin: 12px">
      <BUserCard style="height: 100%" />
    </n-gi>
    <n-gi span="24 l:16" style="padding: 12px">
      <n-flex align="center" style="height: 100%" :vertical="true">
        <BUserStats />
        <BUserActive />
      </n-flex>
    </n-gi>
  </n-grid>
</template>
<script setup lang="ts">
import BUserCard from '@/pages/user/components/profile/BUserCard.vue'
import BUserStats from '@/pages/user/components/profile/BUserStats.vue'

import BUserActive from '@/pages/user/components/profile/BUserActive.vue'
</script>
<style scoped></style>
