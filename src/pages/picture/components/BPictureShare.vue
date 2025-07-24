<template>
  <n-modal
    title="图片分享"
    style="max-width: 600px"
    v-model:show="isShow"
    preset="card"
    size="huge"
    :bordered="false"
  >
    <div style="margin-left: 12px">
      分享链接:
      <n-a :href="props.link">{{ props.link }}</n-a>
    </div>
    <n-qr-code :value="props.link" />
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isShow = ref<boolean>(false)
const props = defineProps(['link'])

const openModal = () => {
  isShow.value = true
}

defineExpose({
  openModal,
})
</script>

<style scoped></style>
