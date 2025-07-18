<template>
  <div style="margin-top: 32px"></div>
  <n-grid cols="1 l:24" responsive="screen" item-responsive>
    <n-gi span="1 l:16" offset="0 l:3">
      <n-breadcrumb>
        <n-breadcrumb-item
          >当前图片上传至个人空间:
          <router-link to="/space/person" style="color: #ff69b4"
            >{{ spaceName }}(点击返回个人空间)
          </router-link>
        </n-breadcrumb-item>
      </n-breadcrumb>
      <n-card title="批量上传图片" style="margin-top: 16px">
        <n-upload
          multiple
          directory-dnd
          action="/api/picture/upload/file"
          :on-before-upload="checkUploadImage"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <ArchiveIcon />
              </n-icon>
            </div>
            <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传</n-text>
            <n-p depth="3" style="margin: 8px 0 0 0"> 请不要上传敏感数据</n-p>
          </n-upload-dragger>
        </n-upload>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { checkUploadImage } from '@/utils/util.ts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const spaceId = ref()
const spaceName = ref()

onMounted(() => {
  spaceId.value = (route.query.space_id as string) || undefined
  spaceName.value = (route.query.space_name as string) || undefined
})
</script>

<style scoped></style>
