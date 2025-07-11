<template>
  <n-card style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 16px">
    <n-flex justify="space-between" align="center">
      <div>
        <n-h2 style="margin-bottom: 16px">头像</n-h2>
        <n-p style="margin: 0">这是您的头像设置</n-p>
        <n-p style="margin: 0">您可以点击头像以上传图片文件</n-p>
      </div>
      <n-flex>
        <n-upload :show-file-list="false" :custom-request="sendFile" :on-before-upload="imageCheck">
          <n-avatar
            round
            :size="64"
            :src="userInfo.avatar ?? 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'"
          >
          </n-avatar>
        </n-upload>
      </n-flex>
    </n-flex>
    <div style="height: 12px"></div>
    <n-text depth="3">用户名长度最大为 16, 可以是任意字符。</n-text>
    <BPictureCropper ref="picture-cropper" @upload="handleUpload" />
  </n-card>
</template>
<script setup lang="ts">
import BPictureCropper from '@/components/BPictureCropper.vue'
import { useTemplateRef } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import type { UploadCustomRequestOptions } from 'naive-ui'
import { uploadAvatarUsingPost } from '@/api/userController.ts'

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

/**
 * 上传前的校验
 * @param options
 */
const imageCheck = (options: UploadCustomRequestOptions) => {
  if (options.file.file == null) {
    return
  }
  //取 文件信息出来
  const file: File = options.file.file
  //判断图片类型
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg' ||
    file.type === 'image/webp'

  if (!isJpgOrPng) {
    message.error('图片类型错误 请上传jpeg/png/webp/jpg 格式的图片')
    return isJpgOrPng
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('上传的头像大小不能超过5M')
    return isLt5M
  }
}
</script>
<style scoped></style>
