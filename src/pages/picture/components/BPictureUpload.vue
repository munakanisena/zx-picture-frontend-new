<template>
  <n-card title="上传图片" style="margin-top: 16px">
    <n-tabs type="line" animated>
      <n-tab-pane name="file-upload" tab="文件上传">
        <n-upload
          :show-file-list="false"
          :on-before-upload="checkUploadImage"
          :custom-request="handleFileUpload"
          directory-dnd
          :max="1"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <ArchiveIcon />
              </n-icon>
            </div>
            <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传</n-text>
          </n-upload-dragger>
        </n-upload>
      </n-tab-pane>
      <n-tab-pane name="url-upload" tab="地址上传">
        <n-input-group>
          <n-input size="large" v-model:value="imageUrl" placeholder="请输入图片网络地址" />
          <n-button size="large" type="primary" @click="handleUrlUpload"> 上传</n-button>
        </n-input-group>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadCustomRequestOptions } from 'naive-ui'
import {
  uploadPictureByFileToPublicUsingPost,
  uploadPictureByFileToSpaceUsingPost, uploadPictureByUrlToPublicUsingPost
} from '@/api/pictureController.ts'
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { checkUploadImage } from '@/utils/util.ts'

const emit = defineEmits(['fetchPictureDetail'])
const imageUrl = ref()
const message = useMessage()
const loadingBar = useLoadingBar()
const props = defineProps<{
  spaceId: number | undefined
}>()

//自定义文件上传
const handleFileUpload = async (options: UploadCustomRequestOptions) => {
  const file: File = options.file.file as File
  loadingBar.start()
  if (props.spaceId) {
    const { data } = await uploadPictureByFileToSpaceUsingPost({}, { spaceId: props.spaceId }, file)
    emit('fetchPictureDetail', data as API.PictureDetailVO)
  } else {
    const { data } = await uploadPictureByFileToPublicUsingPost({}, {}, file)
    emit('fetchPictureDetail', data as API.PictureDetailVO)
  }
  loadingBar.finish()
  message.success('图片上传成功！')
}

// 地址上传
const handleUrlUpload = async () => {
  if (!imageUrl.value) {
    message.warning('请输入图片地址')
    return
  }
  loadingBar.start()
  const { data } = await uploadPictureByUrlToPublicUsingPost({ pictureUrl: imageUrl.value })
  loadingBar.finish()
  message.success('图片上传成功！')
  emit('fetchPictureDetail', data as API.PictureDetailVO)
}
</script>
