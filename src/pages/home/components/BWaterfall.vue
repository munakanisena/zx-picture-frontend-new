<template>
  <masonry-wall :items="pictureList" :ssr-columns="1" :column-width="300" :gap="16">
    <template #default="{ item }">
      <n-card
        style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
        :title="item.picName"
        hoverable
        embedded
        content-style="padding: 0"
      >
        <template #cover>
          <div @click="doClickPicture(item.id as number)">
            <img :src="item.compressUrl" alt="cover" />
          </div>
        </template>
        <template #header-extra>
          <n-flex vertical align="center">
            <n-avatar round :src="item.userAvatar" />
            <span class="user-name">{{ item.userName }}</span>
          </n-flex>
        </template>
        <n-button-group size="large" style="height: 50px; width: 100%; display: flex">
          <n-button @click="clickLike(item)" style="flex: 1; height: 50px">
            <template #icon>
              <n-icon>
                <HeartOutline v-if="!item.isLike" />
                <HeartSharp v-else />
              </n-icon>
            </template>
            {{ item.likeQuantity }}
          </n-button>
          <n-button @click="clickCollect(item)" style="flex: 1; height: 50px">
            <template #icon>
              <n-icon>
                <BookmarkOutline v-if="!item.isCollect" />
                <Bookmark v-else />
              </n-icon>
            </template>
            {{ item.collectQuantity }}
          </n-button>
          <n-button @click="shareAction(item)" style="flex: 1; height: 50px">
            <template #icon>
              <n-icon>
                <ShareSocialOutline />
              </n-icon>
            </template>
          </n-button>
        </n-button-group>
      </n-card>
    </template>
  </masonry-wall>
  <BPictureShare ref="pictureShareRef" :link="shareLink" />
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { useMessage } from 'naive-ui'
import MasonryWall from '@yeger/vue-masonry-wall'
import {
  Bookmark,
  BookmarkOutline,
  HeartOutline,
  HeartSharp,
  ShareSocialOutline,
} from '@vicons/ionicons5'
import { likeOrCollectionUsingPost } from '@/api/pictureController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { PIC_INTERACTION_STATUS_MAP, PIC_INTERACTION_TYPE_MAP } from '@/constants/picture.ts'
import BPictureShare from '@/pages/picture/components/BPictureShare.vue'
import { useRouter } from 'vue-router'

const message = useMessage()
const props = defineProps(['pictureList'])
const pictureList = ref<API.PictureHomeVO[]>([])
const shareLink = ref<string>()
const pictureShareRef = useTemplateRef('pictureShareRef')
const router = useRouter()

watch(
  () => props.pictureList,
  (newVal) => {
    if (newVal) {
      pictureList.value = newVal
    }
  },
)

onMounted(() => {
  if (props.pictureList) {
    pictureList.value = props.pictureList
  }
})

//状态维护 避免多次点击
const actioLike = ref(true)
const actioLCollect = ref(true)

//点赞
const clickLike = async (pictureHomeVO: API.PictureHomeVO) => {
  //这里需要判断是否登录了。未登录跳转
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
  //这里需要判断是否登录了。未登录跳转
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

//分享
const shareAction = (pictureHomeVO: API.PictureHomeVO) => {
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
