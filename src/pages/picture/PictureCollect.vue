<template>
  <div style="padding: 24px">
    <n-flex vertical>
      <n-h1 style="margin: 0">收藏图片列表</n-h1>
      <!--搜索栏-->
      <n-card :bordered="false">
        <n-grid :x-gap="12" :cols="4" item-responsive responsive="screen">
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片名称" label-placement="left">
              <n-input
                v-model:value="searchParams.picName"
                placeholder="请输入图片名称"
                clearable
              />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-form-item label="标签(可以输入多个)" label-placement="left">
              <n-select
                v-model:value="searchParams.tags"
                tag
                filterable
                multiple
                placeholder="请输入图片标签"
              />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片格式" label-placement="left">
              <n-select
                v-model:value="searchParams.originFormat"
                :options="PIC_FORMAT_OPTION"
                placeholder="请选择图片格式"
                clearable
              />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-space>
              <n-button type="primary" @click="fetchCollectPictureList">
                <template #icon>
                  <n-icon :component="SearchOutline" />
                </template>
                搜索
              </n-button>
              <n-button @click="handleResetSearchParma">
                <template #icon>
                  <n-icon :component="RefreshOutline" />
                </template>
                刷新重置数据
              </n-button>
            </n-space>
          </n-gi>
        </n-grid>
      </n-card>
      <!--图片展示列表-->
      <n-grid
        v-if="collectPictureList?.length > 0"
        :x-gap="12"
        :y-gap="12"
        cols="1 s:2 m:3 l:4 xl:5 "
        responsive="screen"
      >
        <n-gi span="1" v-for="pictureHomeVO in collectPictureList" :key="pictureHomeVO.id">
          <n-card style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"  embedded>
            <template #cover>
              <div
                style="height: 300px; overflow: hidden; cursor: pointer"
                @click="doClickPicture(pictureHomeVO.id as number)"
              >
                <!--占满整个容器-->
                <n-image
                  style="height: 100%; width: 100%"
                  preview-disabled
                  lazy
                  :src="pictureHomeVO.compressUrl"
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
                  style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 60%;
                  "
                >
                  {{ pictureHomeVO.picName }}
                </span>
                <n-space>
                  <n-button
                    text
                    style="font-size: 20px"
                    @click="cancelCollect(pictureHomeVO)"
                    title="取消收藏"
                  >
                    <n-icon>
                      <HeartOutline />
                    </n-icon>
                  </n-button>
                  <n-button
                    text
                    style="font-size: 20px"
                    @click="shareAction(pictureHomeVO)"
                    title="分享"
                  >
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
      <n-card :bordered="false" v-else>
        <n-empty size="large" description="你什么也找不到" style="width: 100%; height: 100%">
          <template #extra>
            <n-button
              size="small"
              @click="
                $router.push({
                  name: 'home',
                })
              "
            >
              去收藏图片
            </n-button>
          </template>
        </n-empty>
      </n-card>
      <!--分页-->
    </n-flex>
    <div style="margin-top: 20px"></div>
    <n-flex justify="end">
      <n-pagination
        v-show="collectPictureList?.length > 0"
        :item-count="pagination.itemCount"
        size="large"
        v-model:page="pagination.page"
        :prefix="
          (paginationInfo: PaginationInfo) => {
            return '共' + paginationInfo.itemCount + '条'
          }
        "
        :on-update:page="handlePageChange"
      ></n-pagination>
    </n-flex>
    <!--分享弹窗-->
    <BPictureShare ref="pictureShareRef" :link="shareLink" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import {
  PIC_FORMAT_OPTION,
  PIC_INTERACTION_STATUS_ENUM,
  PIC_INTERACTION_TYPE_ENUM,
} from '@/constants/picture.ts'
import { HeartOutline, RefreshOutline, SearchOutline, ShareSocialOutline } from '@vicons/ionicons5'
import type { PaginationInfo } from 'naive-ui'
import {
  getCollectPictureListUsingPost,
  likeOrCollectionUsingPost,
} from '@/api/pictureController.ts'
import BPictureShare from '@/pages/picture/components/BPictureShare.vue'
import { useRouter } from 'vue-router'

const shareLink = ref<string>()
const router = useRouter()
const message = useMessage()
const pictureShareRef = useTemplateRef('pictureShareRef')
const collectPictureList = ref<API.PictureHomeVO[]>()
// 定义搜索参数的初始状态
const initialSearchParams: API.PictureQueryRequest = {
  current: 1,
  pageSize: 10,
  picName: null,
  tags: null,
  originFormat: null,
}
const searchParams = ref<API.PictureQueryRequest>(structuredClone(initialSearchParams))

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
})

const fetchCollectPictureList = async () => {
  const { data } = await getCollectPictureListUsingPost({
    ...searchParams.value,
    current: pagination.page,
    pageSize: pagination.pageSize,
  })
  if (data && data?.records?.length > 0) {
    collectPictureList.value = data.records
    pagination.itemCount = data.total as number
  } else {
    collectPictureList.value = []
  }
}

//重置搜索条件
const handleResetSearchParma = async () => {
  searchParams.value = structuredClone(initialSearchParams)
  await fetchCollectPictureList()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchCollectPictureList()
}

const cancelCollect = async (pictureHomeVO: API.PictureHomeVO) => {
  try {
    await likeOrCollectionUsingPost({
      id: pictureHomeVO.id as number,
      interactionType: PIC_INTERACTION_TYPE_ENUM.COLLECT,
      interactionStatus: pictureHomeVO.isLike
        ? PIC_INTERACTION_STATUS_ENUM.NOT_INTERACTED
        : PIC_INTERACTION_STATUS_ENUM.INTERACTED,
    })
    message.success('取消收藏成功')
    await fetchCollectPictureList()
  } catch (e: any) {
    console.log(e.message)
  }
}

//分享
const shareAction = (pictureHomeVO: API.PictureHomeVO) => {
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/detail/${pictureHomeVO.id}`
  pictureShareRef.value?.openModal()
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
