<template>
  <div style="width: 100%; margin: 12px 24px 0 24px">
    <n-flex>
      <n-input-group style="width: 80%; max-width: 800px; margin: 16px auto">
        <n-image
          style="margin-right: 16px"
          object-fit="contain"
          height="48"
          preview-disabled
          :src="searchIcon"
        ></n-image>
        <n-input
          v-model:value="searchText"
          type="text"
          placeholder="人生嘛。失败总是难免的...."
          style="height: 48px; line-height: 48px"
          round
          status="warning"
          size="large"
          @keydown.enter="searchHomePicture"
        />
        <n-button
          type="warning"
          round
          ghost
          @click="searchHomePicture"
          size="large"
          style="height: 48px"
          >搜索
        </n-button>
      </n-input-group>
    </n-flex>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import searchIcon from '@/image/search-icon.jpg'

const emit = defineEmits(['search'])

const searchText = ref<string>()

const searchHomePicture = () => {
  emit('search', searchText.value)
}
</script>
<style scoped></style>
