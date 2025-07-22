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
      <BPictureUpload :space-id="undefined" @fetchPictureDetail="fetchPictureDetail" />
    </n-gi>
    <!--图片展示-->
    <n-gi span="1 l:16" v-else>
      <n-breadcrumb style="margin-bottom: 8px">
        <n-breadcrumb-item
          v-if="useLoginUserStore().userInfo.role === USER_ROLE_ENUM.ADMIN && !spaceId"
        >
          <router-link :to="{ name: 'picture-manager' }" style="color: #ff69b4">
            返回图片管理页面
          </router-link>
        </n-breadcrumb-item>
        <n-breadcrumb-item v-else>
          <router-link v-if="spaceType == 1" to="/space/person" style="color: #ff69b4"
            >{{ spaceName }}(点击返回个人空间)
          </router-link>
          <router-link
            v-else
            :to="{ name: 'space-team', query: { space_id: spaceId || '' } }"
            style="color: #ff69b4"
            >{{ spaceName }}(点击返回团队空间)
          </router-link>
        </n-breadcrumb-item>
      </n-breadcrumb>
      <n-card embedded>
        <template #cover>
          <div style="height: 600px">
            <n-image
              style="width: 100%; height: 100%"
              :src="pictureDetail?.compressUrl"
              object-fit="contain"
              alt="图片预览"
            />
          </div>
        </template>
        <template #action>
          <n-button
            style="width: 100%; margin: 0 auto"
            color="#ff69b4"
            ghost
            size="large"
            @click="imageCropper?.openModalAndSendImage(pictureDetail.compressUrl)"
            >裁剪图片
          </n-button>
        </template>
      </n-card>
    </n-gi>
    <!--图片详情组件-->
    <n-gi span="1 l:8">
      <n-flex>
        <BPictureInfo
          v-if="!!pictureDetail"
          style="max-height: 800px; margin-top: 32px"
          :pictureDetail="pictureDetail"
          :show-more="false"
        />
        <!--图片编辑组件-->
        <BPictureEditForm v-if="!!pictureDetail" :pictureDetail="pictureDetail" />
        <n-card title="AI扩图(点击立马开始扩图,一天一次)">
          <n-button
            type="primary"
            color="#8a2be2"
            size="large"
            @click="router.push({ name: 'picture-ai-extend', params: { id: pictureDetail?.id } })"
            block
          >
            AI扩图
          </n-button>
        </n-card>
      </n-flex>
    </n-gi>
  </n-grid>
  <!--裁剪组件-->
  <BPictureCropper
    :spaceType="spaceType"
    :picture-id="pictureDetail.id as any"
    v-if="!!pictureDetail"
    ref="picture-cropper"
    @upload="handleUploadCrop"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import BPictureUpload from '@/pages/picture/components/BPictureUpload.vue'
import BPictureInfo from '@/pages/picture/components/BPictureInfo.vue'
import BPictureCropper from '@/components/BPictureCropper.vue'
import BPictureEditForm from '@/pages/picture/components/BPictureEditForm.vue'
import {
  getPictureDetailByIdUsingGet,
  uploadPictureByFileToPublicUsingPost,
  uploadPictureByFileToSpaceUsingPost,
} from '@/api/pictureController.ts'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { USER_ROLE_ENUM } from '@/constants/user.ts'

const { pictureId, spaceId, spaceName, spaceType } = defineProps<{
  pictureId: string
  spaceId?: string
  spaceName?: string
  spaceType?: string
}>()
const router = useRouter()
const message = useMessage()
const pictureDetail = ref<API.PictureDetailVO>()
const imageCropper = useTemplateRef('picture-cropper')
const loadingBar = useLoadingBar()

//裁剪后上传
const handleUploadCrop = async (file: File) => {
  loadingBar.start()
  if (spaceId) {
    const { data } = await uploadPictureByFileToSpaceUsingPost(
      {},
      {
        id: pictureDetail.value?.id,
        spaceId: spaceId,
      },
      file,
    )
    pictureDetail.value = data as API.PictureDetailVO
  } else {
    const { data } = await uploadPictureByFileToPublicUsingPost(
      {},
      { id: pictureDetail.value?.id },
      file,
    )
    pictureDetail.value = data as API.PictureDetailVO
  }
  loadingBar.finish()
  message.success('图片上传成功！')
}

//获取上传后的图片信息 并且打开模态框编辑
const fetchPictureDetail = (pictureInfo: API.PictureDetailVO) => {
  pictureDetail.value = pictureInfo as API.PictureDetailVO
}

onMounted(async () => {
  const { data } = await getPictureDetailByIdUsingGet({ pictureId: pictureId })
  pictureDetail.value = data
})
</script>

<style scoped></style>
