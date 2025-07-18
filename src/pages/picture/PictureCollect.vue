<template>
  <div style="padding: 24px">
    <n-flex vertical>
      <n-h1 style="margin: 0">收藏图片列表</n-h1>
      <!--搜索栏-->
      <n-card :bordered="false">
        <n-grid :x-gap="12" :cols="4" item-responsive responsive="screen">
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片名称" label-placement="left">
              <n-input v-model:value="searchParma.picName" placeholder="请输入图片名称" clearable />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片标签" label-placement="left">
              <n-input v-model:value="searchParma.tags" placeholder="请输入标签" clearable />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片格式" label-placement="left">
              <n-select
                v-model:value="searchParma.originFormat"
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
      <n-card :bordered="false" v-if="!collectPictureList">
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
      <BPictureList :picture-list="collectPictureList" v-else />
      <!--分页-->
    </n-flex>
    <div style="margin-top: 20px"></div>
    <n-flex justify="end">
      <n-pagination
        :item-count="pagination.itemCount"
        size="large"
        v-model:page="pagination.page"
        :page-count="pagination.pageCount"
        :prefix="
          (paginationInfo: PaginationInfo) => {
            return '共' + paginationInfo.itemCount + '条'
          }
        "
        :on-update:page="handlePageChange"
      ></n-pagination>
    </n-flex>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { PIC_FORMAT_OPTION } from '@/constants/picture.ts'
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import type { PaginationInfo } from 'naive-ui'
import BPictureList from '@/pages/picture/components/BPictureList.vue'
import { getCollectPictureListUsingPost } from '@/api/pictureController.ts'

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  pageCount: 0,
  itemCount: 0,
})

const collectPictureList = ref<API.PictureHomeVO[]>()
const searchParma = ref<API.PictureQueryRequest>({})

const fetchCollectPictureList = async () => {
  const { data } = await getCollectPictureListUsingPost({
    ...searchParma.value,
    current: pagination.page,
    pageSize: pagination.pageSize,
  })
  if (data?.records?.length == 0) return
  collectPictureList.value = data.records
  pagination.itemCount = data.total as number
  pagination.pageCount = data.pages as number
}

//重置搜索条件
const handleResetSearchParma = async () => {
  searchParma.value = {
    current: 1,
    pageSize: 20,
    searchText: undefined,
    tags: undefined,
    categoryId: undefined,
    startEditTime: undefined,
    endEditTime: undefined,
    originFormat: undefined,
  }
  await fetchCollectPictureList()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchCollectPictureList()
}

onMounted(() => {
  fetchCollectPictureList()
})
</script>

<style scoped></style>
