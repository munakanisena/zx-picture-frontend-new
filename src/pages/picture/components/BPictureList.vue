<template>
  <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4 xl:5 " responsive="screen">
    <n-gi span="1" v-for="pictureVO in pictureList" :key="pictureVO.id">
      <n-card
        style="
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          height: 350px;
          text-align: center;
        "
        :title="pictureVO.picName"
        hoverable
        embedded
        content-style="padding: 0"
      >
        <template #cover>
          <div @click="doClickPicture(pictureVO.id as number)">
            <n-image lazy :src="pictureVO.compressUrl" object-fit="contain"></n-image>
          </div>
        </template>
        <n-button-group size="small" style="height: 50px; width: 100%; display: flex">
          <n-button
            v-if="loginUserMember?.spaceRole !== SPACE_ROLE_ENUM.VIEWER"
            @click="doEditPicture(pictureVO)"
            style="flex: 1; height: 50px"
          >
            <template #icon>
              <n-icon>
                <BuildOutline />
              </n-icon>
            </template>
            编辑
          </n-button>
          <n-button
            v-if="loginUserMember?.spaceRole !== SPACE_ROLE_ENUM.VIEWER"
            @click="doClickDelete(pictureVO.id as number)"
            style="flex: 1; height: 50px"
          >
            <template #icon>
              <n-icon>
                <TrashOutline />
              </n-icon>
            </template>
            删除
          </n-button>
          <n-button @click="shareAction(pictureVO)" style="flex: 1; height: 50px">
            <template #icon>
              <n-icon>
                <ShareSocialOutline />
              </n-icon>
            </template>
            分享
          </n-button>
        </n-button-group>
      </n-card>
    </n-gi>
  </n-grid>
  <BPictureShare ref="pictureShareRef" :link="shareLink" />
</template>

<script setup lang="ts">
import { BuildOutline, ShareSocialOutline, TrashOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import BPictureShare from '@/pages/picture/components/BPictureShare.vue'
import { ref, useTemplateRef } from 'vue'
import { deletePictureByIdUsingPost } from '@/api/pictureController.ts'
import { SPACE_ROLE_ENUM } from '@/constants/space.ts' // 引入卡片组件

interface Props {
  pictureList?: API.PictureVO[]
  spaceInfo?: API.SpaceTeamDetailVO | API.SpaceDetailVO
  loginUserMember?: API.SpaceUserVO
}

const shareLink = ref<string>()
const emits = defineEmits(['picture-deleted'])
const props = defineProps<Props>()
const router = useRouter()
const pictureShareRef = useTemplateRef('pictureShareRef')
const message = useMessage()

//编辑
const doEditPicture = (pictureVO: API.PictureVO) => {
  router.push({
    name: 'picture-edit',
    params: { id: pictureVO.id },
    query: {
      space_id: props.spaceInfo?.id,
      space_name: props.spaceInfo?.spaceName,
      space_type: props.spaceInfo?.spaceType,
    },
  })
}

//分享
const shareAction = (pictureVO: API.PictureVO) => {
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/detail/${pictureVO.id}`
  pictureShareRef.value?.openModal()
}

//跳转图片详情
const doClickPicture = (pictureId: number) => {
  router.push({ name: 'picture-detail', params: { id: pictureId } })
}

//删除图片
const doClickDelete = async (pictureId: number) => {
  await deletePictureByIdUsingPost({ id: pictureId, spaceId: props.spaceInfo?.id })
  emits('picture-deleted')
  message.success('删除成功')
}
</script>

<style scoped></style>
