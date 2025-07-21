<template>
  <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4 xl:5 " responsive="screen">
    <n-gi span="1" v-for="pictureVO in pictureList" :key="pictureVO.id">
      <n-card style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"  embedded>
        <template #cover>
          <div
            style="height: 300px; cursor: pointer; overflow: hidden"
            @click="doClickPicture(pictureVO.id as number)"
          >
            <!--占满整个容器-->
            <n-image
              style="width: 100%; height: 100%"
              preview-disabled
              lazy
              :src="pictureVO.compressUrl"
              object-fit="cover"
            />
          </div>
        </template>
        <!--占位-->
        <n-card
          style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
          hoverable
          content-style="padding: 0"
        >
        </n-card>
        <template #footer>
          <n-flex justify="space-between" align="center">
            <span
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50%"
            >
              {{ pictureVO.picName }}
            </span>
            <n-space>
              <n-button
                v-if="loginUserMember?.spaceRole !== SPACE_ROLE_ENUM.VIEWER"
                text
                style="font-size: 20px"
                @click="doEditPicture(pictureVO)"
                title="编辑"
              >
                <n-icon>
                  <BuildOutline />
                </n-icon>
              </n-button>
              <n-button
                v-if="loginUserMember?.spaceRole !== SPACE_ROLE_ENUM.VIEWER"
                text
                style="font-size: 20px"
                title="删除"
                @click="doClickDelete(pictureVO.id as number)"
              >
                <n-icon>
                  <TrashOutline />
                </n-icon>
              </n-button>
              <n-button text style="font-size: 20px" @click="shareAction(pictureVO)" title="分享">
                <n-icon>
                  <ShareSocialOutline />
                </n-icon>
              </n-button>
            </n-space>
          </n-flex>
        </template>
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
    params: { pictureId: pictureVO.id },
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
  router.push({ name: 'picture-detail', params: { pictureId: pictureId } })
}

//删除图片
const doClickDelete = async (pictureId: number) => {
  await deletePictureByIdUsingPost({ id: pictureId, spaceId: props.spaceInfo?.id })
  emits('picture-deleted')
  message.success('删除成功')
}
</script>

<style scoped></style>
