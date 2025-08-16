<template>
  <n-layout>
    <div
      :style="{ background: `rgba(0, 0, 0, .60) url(${banner})` }"
      style="position: fixed; width: 100%; height: 100%; background-blend-mode: hue"
    ></div>

    <div style="margin: 80px auto; width: min(448px, calc(100% - 16px))">
      <router-view />
    </div>
  </n-layout>
</template>
<script setup lang="ts">
import banner from '@/image/banner.jpg'
</script>
