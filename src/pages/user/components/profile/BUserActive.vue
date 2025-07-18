<template>
  <div style="width: 100%; height: 100%; margin: 0 auto">
    <n-card
      style="
        text-align: center;
        height: 97.5%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-radius: 16px;
      "
      title="收藏图片"
    >
      <n-empty v-if="!collectPictureList" description="你什么也找不到" />
      <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 l:3  " responsive="screen">
        <n-gi span="1" v-for="pictureVO in collectPictureList" :key="pictureVO.id">
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
                <n-image
                  lazy
                  preview-disabled
                  :src="pictureVO.compressUrl"
                  object-fit="contain"
                ></n-image>
              </div>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCollectPictureListUsingPost } from '@/api/pictureController.ts'
import { useRouter } from 'vue-router'

const collectPictureList = ref<API.PictureHomeVO[]>()
const router=useRouter()

const fetchCollectPictureList = async () => {
  const { data } = await getCollectPictureListUsingPost({
    current: 1,
    pageSize: 3,
  })
  if (data?.records?.length == 0) return
  collectPictureList.value = data.records
}

//跳转图片详情
const doClickPicture = (pictureId: number) => {
  router.push({ name: 'picture-detail', params: { id: pictureId } })
}

onMounted(() => {
  fetchCollectPictureList()
})
</script>
<style scoped></style>
