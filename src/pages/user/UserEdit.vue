<template>
  <div style="width: 90%; margin: 0 auto; padding: 16px">
    <n-h1> 账号设置</n-h1>
    <n-divider />
    <div style="max-width: 800px; margin: 0 auto">
      <BUserAvatar style="margin-top: 32px" />
      <BUserName style="margin-top: 32px" />
      <BUserIntroduction style="margin-top: 32px" />
    </div>
  </div>
</template>
<script setup lang="ts">
import BUserAvatar from '@/pages/user/components/edit/BUserAvatar.vue'
import BUserName from '@/pages/user/components/edit/BUserName.vue'
import BUserIntroduction from '@/pages/user/components/edit/BUserIntroduction.vue'
</script>
<style scoped></style>
