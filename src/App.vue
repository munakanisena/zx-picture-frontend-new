<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-loading-bar-provider container-style="white-space: pre-wrap">
        <router-view v-slot="{ Component }">
          <keep-alive include="['MainLayout]">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
</script>
<style scoped></style>
