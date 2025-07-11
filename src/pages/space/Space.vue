<template>
  <div style="padding: 24px">
    <!--个人空间头部-->
    <n-flex align="center" justify="space-between" style="height: 100%">
      <n-h1 style="margin: 0">个人空间({{ spaceInfo?.spaceName }})</n-h1>
      <n-button-group>
        <n-space>
          <n-button @click="handleUpload" type="primary" secondary>
            <template #icon>
              <n-icon :component="CloudUploadOutline" />
            </template>
            上传图片
          </n-button>
          <n-button type="primary">
            <template #icon>
              <n-icon :component="AlbumsOutline" />
            </template>
            批量上传图片
          </n-button>
        </n-space>
      </n-button-group>
      <n-card title="空间使用情况" size="small" collapsible>
        <n-flex vertical>
          <div>
            <n-text
              >存储空间: {{ bytesToMB(spaceInfo?.usedSize as number) }}MB /
              {{ bytesToMB(spaceInfo?.maxSize as number) }} MB
            </n-text>
            <n-progress
              type="line"
              :percentage="
                calculatePercentage(
                  bytesToMB(spaceInfo?.usedSize as number),
                  bytesToMB(spaceInfo?.maxSize as number),
                )
              "
              :indicator-placement="'inside'"
              :height="24"
              processing
              :color="themeVars.successColor"
              :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })"
            />
          </div>
          <div>
            <n-text> 存储数量: {{ spaceInfo?.usedCount }} / {{ spaceInfo?.maxCount }} 张</n-text>
            <n-progress
              type="line"
              :height="24"
              :percentage="
                calculatePercentage(spaceInfo?.usedCount as number, spaceInfo?.maxCount as number)
              "
              status="success"
              processing
              :indicator-placement="'inside'"
              :color="themeVars.successColor"
              :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })"
            />
          </div>
        </n-flex>
      </n-card>
      <!--搜索栏-->
      <n-card :bordered="false">
        <n-grid :x-gap="12" :cols="4" item-responsive responsive="screen">
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片名称" label-placement="left">
              <n-input v-model:value="searchParma.picName" placeholder="请输入图片名称" clearable />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片分类" label-placement="left">
              <n-select
                v-model:value="searchParma.categoryId"
                :options="categoryToOptions(categoryList)"
                placeholder="请选择分类"
                clearable
              />
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
          <n-gi span="4 m:2 l:2">
            <n-form-item label="上传日期" label-placement="left">
              <n-date-picker
                type="daterange"
                clearable
                style="width: 100%"
                :on-confirm="onConfirmRange"
                :on-clear="onClearRange"
              />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-space>
              <n-button type="primary" @click="fetchPictureList">
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
      <n-card :bordered="false" v-if="!pictureList">
        <n-empty size="large" description="你什么也找不到" style="width: 100%; height: 100%">
          <template #extra>
            <n-button size="small" @click="handleUpload"> 上传图片</n-button>
          </template>
        </n-empty>
      </n-card>
      <BWaterfall v-else :pictureList="pictureList" />
    </n-flex>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPicturePageListAsPersonSpaceUsingPost } from '@/api/pictureController.ts'
import { getPrivateSpaceDetailByLoginUserUsingGet } from '@/api/spaceController.ts'
import { useRouter } from 'vue-router'
import { AlbumsOutline, CloudUploadOutline, RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { bytesToMB, calculatePercentage, categoryToOptions } from '@/utils/util.ts'
import BWaterfall from '@/pages/home/components/BWaterfall.vue'
import { listHomeCategoriesUsingGet } from '@/api/homeController.ts'
import { PIC_FORMAT_OPTION } from '@/constants/picture.ts'
import { useThemeVars } from 'naive-ui'
import { changeColor } from 'seemly'
import dayjs from 'dayjs'

const themeVars = useThemeVars()
const router = useRouter()
const loadingBar=useLoadingBar()
const searchParma = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 20,
  searchText: undefined,
  categoryId: undefined,
})
const spaceInfo = ref<API.SpaceDetailVO>()
const pictureList = ref<API.PictureVO[]>()

/**
 * 确认日期的回调
 * @param range
 */
const onConfirmRange = (range: [string, string]) => {
  if (range.length < 2) return
  searchParma.value.startEditTime = dayjs(range[0]).format('YYYY-MM-DD HH:mm:ss')
  searchParma.value.endEditTime = dayjs(range[1]).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 清除日期时的回调
 */
const onClearRange = () => {
  searchParma.value.startEditTime = undefined
  searchParma.value.endEditTime = undefined
}

const fetchPictureList = async () => {
  loadingBar.start()
  const { data } = await getPicturePageListAsPersonSpaceUsingPost({ ...searchParma.value })
  if (data.records?.length < 0) return
  pictureList.value = data.records
  loadingBar.finish()
}

const fetchSpaceInfo = async () => {
  const { data } = await getPrivateSpaceDetailByLoginUserUsingGet({ ...searchParma })
  spaceInfo.value = data
}

//先获取一次 检查是否存在
const checkSpaceInfo = async () => {
  const { data } = await getPrivateSpaceDetailByLoginUserUsingGet()
  if (data == null) {
    //不存在 跳转激活页面
    await router.replace('/space-active')
  }
}

//跳转到上传图片
const handleUpload = () => {
  router.push({
    name: 'picture-upload',
    query: {
      space_id: spaceInfo.value?.id,
      space_name: spaceInfo.value?.spaceName,
    },
  })
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
  await fetchPictureList()
}

const categoryList = ref<API.CategoryVO[]>()

onMounted(async () => {
  await checkSpaceInfo()
  await fetchSpaceInfo()
  await fetchPictureList()
  const { data } = await listHomeCategoriesUsingGet()
  categoryList.value = data
})
</script>
<style scoped></style>
