<template>
  <n-card style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 16px">
    <n-flex justify="space-between" align="center">
      <div>
        <n-h2 style="margin-bottom: 16px">头像</n-h2>
        <n-p style="margin: 0">这是您的头像设置</n-p>
        <n-p style="margin: 0">您可以点击头像以上传图片文件</n-p>
      </div>
      <n-flex>
        <n-upload
          :show-file-list="false"
          :custom-request="sendFile"
          :on-before-upload="checkUploadImage"
        >
          <n-avatar v-if="userInfo.avatar" round :size="64" :src="userInfo.avatar"> </n-avatar>
          <n-icon :size="64" v-else :component="PersonCircleOutline"></n-icon>
        </n-upload>
      </n-flex>
    </n-flex>
    <div style="height: 12px"></div>
    <n-text depth="3">头像不是必须,但设置比较好!</n-text>
    <BPictureCropper ref="picture-cropper" @upload="handleUpload" />
  </n-card>
</template>
<script setup lang="ts">
import BPictureCropper from '@/components/BPictureCropper.vue'
import { useTemplateRef } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import type { UploadCustomRequestOptions } from 'naive-ui'
import { uploadAvatarUsingPost } from '@/api/userController.ts'
import { checkUploadImage } from '@/utils/util.ts'
import { PersonCircleOutline } from '@vicons/ionicons5'

const message = useMessage()
const cropperRef = useTemplateRef('picture-cropper')
const userInfo = useLoginUserStore().userInfo

/**
 * 发送图片进行裁剪
 * @param options 上传参数
 */
const sendFile = (options: UploadCustomRequestOptions) => {
  cropperRef.value?.openModalAndSendImage(options.file.file as File)
}

/**
 * 上传头像
 * @param file 上传的文件
 */
const handleUpload = async (file: File) => {
  const { data } = await uploadAvatarUsingPost({}, file)
  message.success('头像上传成功')
  userInfo.avatar = data as string
}
</script>
<style scoped></style>
