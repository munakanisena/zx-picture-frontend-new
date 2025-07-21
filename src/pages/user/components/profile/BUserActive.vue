<template>
  <div style="width: 100%; height: 100%; margin: 0 auto">
    <n-card
      style="
        text-align: center;
        height: 100%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-radius: 16px;
      "
      title="收藏图片"
    >
      <n-empty
        style="
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
        size="large"
        v-if="!collectPictureList"
        description="你什么也找不到"
      />
      <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 l:3  " responsive="screen">
        <n-gi span="1" v-for="pictureVO in collectPictureList" :key="pictureVO.id">
          <n-card
            style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
            :title="pictureVO.picName"
            embedded
          >
            <template #cover>
              <div
                style="height: 270px; overflow: hidden; cursor: pointer"
                @click="doClickPicture(pictureVO.id as number)"
              >
                <!--占满整个容器-->
                <n-image
                  style="height: 100%; width: 100%"
                  lazy
                  preview-disabled
                  :src="pictureVO.compressUrl"
                  object-fit="cover"
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
const router = useRouter()

const fetchCollectPictureList = async () => {
  const { data } = await getCollectPictureListUsingPost({
    current: 1,
    pageSize: 3,
  })
  if (data?.records?.length == 0) return
  collectPictureList.value = data.records || []
}

//跳转图片详情
const doClickPicture = (pictureId: number) => {
  router.push({ name: 'picture-detail', params: { pictureId: pictureId } })
}

onMounted(() => {
  fetchCollectPictureList()
})
</script>
<style scoped></style>
