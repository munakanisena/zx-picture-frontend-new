<template>
  <n-drawer :width="280" :auto-focus="false" placement="left">
    <n-drawer-content
      :native-scrollbar="false"
      :scrollbar-props="{ trigger: 'none' }"
      header-style="height: 100px; padding: 0"
    >
      <template #header>
        <div
          style="position: absolute; width: 100%; height: 100px; top: 0; background: #ea6aa8"
        ></div>
      </template>
      <div>
        <slot />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts">
interface Props {
  username?: string
  userAvatar?: string
}
const props = withDefaults(defineProps<Props>(), {
  username: '未登录',
  userAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
})
</script>
