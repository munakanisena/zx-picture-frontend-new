<template>
  <div style="display: flex; margin: 16px 0 0 16px"></div>
  <n-grid
    style="width: 90%; margin: 0 auto; padding: 24px"
    x-gap="24"
    y-gap="12"
    cols="1 l:24"
    responsive="screen"
    item-responsive
  >
    <!--上传组件-->
    <n-gi span="1 l:16" offset="l:3" v-if="!pictureDetail">
      <n-breadcrumb style="margin-bottom: 8px">
        <n-breadcrumb-item v-if="!spaceId">当前图片上传至公共图库</n-breadcrumb-item>
        <n-breadcrumb-item v-else
          >当前图片上传至个人空间:
          <n-a href="/space/person" style="color: #ff69b4"> {{ spaceName }}(点击返回个人空间)</n-a>
        </n-breadcrumb-item>
      </n-breadcrumb>
      <BPictureUpload :spaceId="spaceId" @fetchPictureDetail="fetchPictureDetail" />
    </n-gi>
    <!--图片展示-->
    <n-gi span="1 l:16" v-else>
      <n-breadcrumb style="margin-bottom: 8px">
        <n-breadcrumb-item v-if="!spaceId">当前图片上传至公共图库</n-breadcrumb-item>
        <n-breadcrumb-item v-else
          >当前图片上传至个人空间:
          <n-a href="/space/person" style="color: #ff69b4"> {{ spaceName }}(点击返回个人空间)</n-a>
        </n-breadcrumb-item>
      </n-breadcrumb>
      <n-card embedded>
        <template #cover>
          <n-image
            style="max-height: 816px"
            :src="pictureDetail.compressUrl"
            object-fit="contain"
            alt="图片预览"
          />
        </template>
        <template #action>
          <n-button
            style="width: 100%; margin: 0 auto"
            color="#ff69b4"
            size="large"
            @click="imageCropper?.openModalAndSendImage(pictureDetail.compressUrl)"
            >裁剪图片
          </n-button>
        </template>
      </n-card>
    </n-gi>
    <!--图片详情组件-->
    <n-gi span="1 l:8">
      <BPictureInfo
        v-if="!!pictureDetail"
        style="max-height: 800px; margin-top: 32px"
        :pictureDetail="pictureDetail"
        :show-more="false"
      />
      <!--图片编辑组件-->
      <BPictureEditForm
        v-if="!!pictureDetail"
        style="margin-top: 16px"
        :pictureDetail="pictureDetail"
      />
    </n-gi>
  </n-grid>
  <!--裁剪组件-->
  <BPictureCropper v-if="!!pictureDetail" ref="picture-cropper" @upload="handleUploadCrop" />
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import BPictureUpload from '@/pages/picture/components/BPictureUpload.vue'
import BPictureInfo from '@/pages/picture/components/BPictureInfo.vue'
import { useRoute } from 'vue-router'
import BPictureCropper from '@/components/BPictureCropper.vue'
import BPictureEditForm from '@/pages/picture/components/BPictureEditForm.vue'
import { uploadPictureByFileUsingPost } from '@/api/pictureController.ts'

const message = useMessage()
const route = useRoute()
const spaceId = ref()
const spaceName = ref()
const pictureDetail = ref<API.PictureDetailVO>()
const imageCropper = useTemplateRef('picture-cropper')
const loadingBar = useLoadingBar()

//裁剪后上传
const handleUploadCrop = async (file: File) => {
  loadingBar.start()
  const { data } = await uploadPictureByFileUsingPost({}, { id: pictureDetail.value?.id }, file)
  pictureDetail.value = data as API.PictureDetailVO
  loadingBar.finish()
  message.success('图片上传成功！')
}

//获取上传后的图片信息 并且打开模态框编辑
const fetchPictureDetail = (pictureInfo: API.PictureDetailVO) => {
  pictureDetail.value = pictureInfo as API.PictureDetailVO
}

onMounted(() => {
  spaceId.value = (route.query.space_id as string) || undefined
  spaceName.value = (route.query.space_name as string) || undefined
})
</script>

<style scoped></style>
