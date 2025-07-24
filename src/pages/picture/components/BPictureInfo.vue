<template>
  <n-card title="原图信息 (不可以修改)">
    <n-descriptions
      label-placement="left"
      :column="1"
      bordered
      size="small"
      label-style="width: 100px; text-align: center"
    >
      >
      <n-descriptions-item v-if="showMore" label="图片名称"
        >{{ pictureDetail?.picName }}
      </n-descriptions-item>
      <n-descriptions-item v-if="showMore" label="图片介绍"
        >{{ pictureDetail?.picDesc || '无' }}
      </n-descriptions-item>
      <n-descriptions-item label="图片色调">
        <n-space>
          <div
            :style="{
              backgroundColor: toHexColor(pictureDetail?.originColor as string),
              width: '64px',
              height: '20px',
            }"
          />
          【{{ toHexColor(pictureDetail?.originColor as string) }}】
        </n-space>
      </n-descriptions-item>
      <n-descriptions-item v-if="showMore" label="图片分类"
        >{{ pictureDetail?.categoryName || '无' }}
      </n-descriptions-item>
      <n-descriptions-item v-if="showMore" label="图片标签">
        <n-space v-if="pictureDetail?.tags?.length > 0">
          <n-tag v-for="tag in pictureDetail?.tags" type="success">
            {{ tag }}
          </n-tag>
        </n-space>
        <span v-else>无</span>
      </n-descriptions-item>
      <n-descriptions-item label="原图大小">
        {{ formatSize(pictureDetail?.originSize as number) }}
      </n-descriptions-item>
      <n-descriptions-item label="原图格式">
        <n-tag type="success">{{ pictureDetail?.originFormat }}</n-tag>
      </n-descriptions-item>
      <n-descriptions-item label="原图宽高">
        {{ pictureDetail?.originWidth }} × {{ pictureDetail?.originHeight }}
      </n-descriptions-item>
      <n-descriptions-item label="原图比例">
        {{ pictureDetail?.originScale }}
      </n-descriptions-item>
    </n-descriptions>
  </n-card>
</template>

<script setup lang="ts">
import { formatSize, toHexColor } from '@/utils/util.ts'

const { showMore, pictureDetail } = defineProps<{
  pictureDetail?: API.PictureDetailVO
  showMore?: boolean
}>()
</script>
