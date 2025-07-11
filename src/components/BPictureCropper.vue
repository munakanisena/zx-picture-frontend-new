<template>
  <n-modal
    v-model:show="isShow"
    title="裁剪图片"
    preset="card"
    transform-origin="center"
    class="modal"
  >
    <vue-cropper
      ref="cropperRef"
      :img="imageUrl"
      :original="true"
      :centerBox="true"
      :autoCrop="true"
      :info="true"
      :outputSize="0.8"
      outputType="webp"
      style="width: 100%; height: 80%"
    />
    <div style="height: 32px"></div>
    <n-flex justify="center" align="center">
      <n-button @click="changeScale(1)" size="large">放大</n-button>
      <n-button @click="changeScale(-1)" size="large">缩小</n-button>
      <n-button @click="rotateLeft" size="large">向左旋转</n-button>
      <n-button @click="rotateRight" size="large">向右旋转</n-button>
      <n-button @click="closeModal" size="large">取消</n-button>
      <n-button type="primary" size="large" :loading="loading" @click="handleCrop">确定</n-button>
    </n-flex>
  </n-modal>
</template>
<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { ref, useTemplateRef } from 'vue'

const emit = defineEmits(['upload'])

const isShow = ref<boolean>(false)
const imageUrl = ref<string>()
const loading = ref<boolean>(false)
const cropperRef = useTemplateRef('cropperRef')

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

/**
 * 图片缩放
 * @param num
 */
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
}

//处理裁剪图片
const handleCrop = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    loading.value = true
    const fileName = 'image.webp'
    const file = new File([blob], fileName, { type: blob.type })
    //由父组件决定如何上传
    emit('upload', file)
    loading.value = false
    closeModal()
  })
}

const closeModal = () => {
  isShow.value = false
  //释放Url
  URL.revokeObjectURL(imageUrl.value as string)
}

/**
 * 打开裁剪模态框 并获得裁剪的图片
 * @param imageFileOrUrl 文件或者文件地址
 */
const openModalAndSendImage = (imageFileOrUrl: File | string) => {
  isShow.value = true
  if (imageFileOrUrl instanceof File) {
    imageUrl.value = URL.createObjectURL(imageFileOrUrl)
  } else {
    imageUrl.value = imageFileOrUrl
  }
}

defineExpose({
  openModalAndSendImage,
})
</script>
<style>
.modal {
  height: 600px;
  width: 800px;
}

@media screen and (max-width: 768px) {
  .modal {
    height: 500px;
    width: 400px;
  }
}
</style>
