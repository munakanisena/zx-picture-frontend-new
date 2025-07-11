<template>
  <n-grid
    style="width: 90%; margin: 0 auto; padding: 24px"
    x-gap="24"
    y-gap="12"
    cols="1 l:24"
    responsive="screen"
    item-responsive
  >
    <!--图片展示-->
    <n-gi span="1 l:16">
      <n-card embedded header-style="padding: 0">
        <template #cover>
          <n-image
            style="max-height: 700px"
            :src="pictureDetail?.compressUrl"
            object-fit="contain"
            alt="图片预览"
          />
        </template>
        <template #header>
          <n-button-group ro size="large" style="height: 50px; width: 100%; display: flex">
            <n-button @click="clickLike(pictureDetail)" style="flex: 1; height: 50px">
              <template #icon>
                <n-icon>
                  <HeartOutline v-if="!pictureDetail?.isLike" />
                  <HeartSharp v-else />
                </n-icon>
              </template>
              {{ pictureDetail?.likeQuantity }}
            </n-button>
            <n-button @click="clickCollect(pictureDetail)" style="flex: 1; height: 50px">
              <template #icon>
                <n-icon>
                  <BookmarkOutline v-if="!pictureDetail?.isCollect" />
                  <Bookmark v-else />
                </n-icon>
              </template>
              {{ pictureDetail?.collectQuantity }}
            </n-button>
            <n-button @click="clickDownload()" style="flex: 1; height: 50px">
              <template #icon>
                <n-icon>
                  <CloudDownloadOutline />
                </n-icon>
              </template>
            </n-button>
            <n-button @click="clickShare(pictureDetail)" style="flex: 1; height: 50px">
              <template #icon>
                <n-icon>
                  <ShareSocialOutline />
                </n-icon>
              </template>
            </n-button>
          </n-button-group>
        </template>
      </n-card>
    </n-gi>
    <!--图片详情组件-->
    <n-gi span="1 l:8">
      <n-flex>
        <BAuthorInfo :pictureDetail="pictureDetail" />
        <BPictureInfo v-if="!!pictureDetail" :pictureDetail="pictureDetail" :show-more="true" />
      </n-flex>
    </n-gi>
  </n-grid>
  <BPictureShare ref="pictureShareRef" :link="shareLink" />
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, useTemplateRef } from 'vue'
import {
  getPictureDetailByIdUsingGet,
  likeOrCollectionUsingPost,
  pictureDownloadUsingPost,
} from '@/api/pictureController.ts'
import BPictureInfo from '@/pages/picture/components/BPictureInfo.vue'
import BAuthorInfo from '@/pages/picture/components/BAuthorInfo.vue'
import {
  Bookmark,
  BookmarkOutline,
  CloudDownloadOutline,
  HeartOutline,
  HeartSharp,
  ShareSocialOutline,
} from '@vicons/ionicons5'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { PIC_INTERACTION_STATUS_MAP, PIC_INTERACTION_TYPE_MAP } from '@/constants/picture.ts'
import BPictureShare from '@/pages/picture/components/BPictureShare.vue'

const shareLink = ref<string>()
const route = useRoute()
const router = useRouter()
const pictureDetail = ref<API.PictureDetailVO>()
const message = useMessage()
const loading = ref<boolean>(false)
const pictureShareRef = useTemplateRef('pictureShareRef')

const fetchPictureDetail = async () => {
  const { data } = await getPictureDetailByIdUsingGet({ pictureId: route.params.id })
  pictureDetail.value = data
}

onMounted(() => {
  fetchPictureDetail()
})

//状态维护 避免多次点击
const actioLike = ref(true)
const actioLCollect = ref(true)

//点赞
const clickLike = async (pictureHomeVO: API.PictureHomeVO) => {
  useLoginUserStore().checkLogin()

  if (!actioLike.value) {
    message.warning('点太快啦！')
    return
  }

  if (pictureHomeVO.isLike) {
    pictureHomeVO.likeQuantity = (pictureHomeVO.likeQuantity || 0) - 1
  } else {
    pictureHomeVO.likeQuantity = (pictureHomeVO.likeQuantity || 0) + 1
  }
  await likeOrCollectionUsingPost({
    id: pictureHomeVO.id as number,
    interactionType: PIC_INTERACTION_TYPE_MAP.LIKE,
    interactionStatus: pictureHomeVO.isLike
      ? PIC_INTERACTION_STATUS_MAP.NOT_INTERACTED
      : PIC_INTERACTION_STATUS_MAP.INTERACTED,
  })
  pictureHomeVO.isLike = !pictureHomeVO.isLike
  message.success(`${pictureHomeVO.isLike ? '点赞成功！' : '取消点赞！'}`)

  actioLike.value = false
  setTimeout(() => {
    actioLike.value = true
  }, 1000)
}

//收藏
const clickCollect = async (pictureHomeVO: API.PictureHomeVO) => {
  useLoginUserStore().checkLogin()

  if (!actioLCollect.value) {
    message.warning('点太快啦！')
    return
  }

  if (pictureHomeVO.isCollect) {
    pictureHomeVO.collectQuantity = (pictureHomeVO.collectQuantity || 0) - 1
  } else {
    pictureHomeVO.collectQuantity = (pictureHomeVO.collectQuantity || 0) + 1
  }

  await likeOrCollectionUsingPost({
    id: pictureHomeVO.id as number,
    interactionType: PIC_INTERACTION_TYPE_MAP.COLLECT,
    interactionStatus: pictureHomeVO.isCollect
      ? PIC_INTERACTION_STATUS_MAP.NOT_INTERACTED
      : PIC_INTERACTION_STATUS_MAP.INTERACTED,
  })
  pictureHomeVO.isCollect = !pictureHomeVO.isCollect
  message.success(`${pictureHomeVO.isCollect ? '收藏成功！' : '取消收藏！'}`)

  actioLCollect.value = false
  setTimeout(() => {
    actioLCollect.value = true
  }, 1000)
}

//下载原图片
const clickDownload = async () => {
  useLoginUserStore().checkLogin()
  loading.value = true
  const { data } = await pictureDownloadUsingPost({ id: pictureDetail.value?.id })

  const link = document.createElement('a')
  link.href = data
  link.download = pictureDetail.value?.picName || 'download.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  loading.value = false
}

//分享
const clickShare = (pictureHomeVO: API.PictureHomeVO) => {
  //构造分享连接
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/detail/${pictureHomeVO.id}`
  pictureShareRef.value?.openModal()
}

//跳转图片详情
const doClickPicture = (pictureId: number) => {
  router.push({ name: 'picture-detail', params: { id: pictureId } })
}
</script>
<style scoped></style>
