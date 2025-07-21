<template>
  <div style="padding: 24px">
    <!--个人空间头部-->
    <n-flex align="center" justify="space-between" style="height: 100%">
      <n-h1 style="margin: 0">个人空间({{ spaceInfo?.spaceName }})</n-h1>
      <n-button-group>
        <n-space>
          <n-button
            @click="
              $router.push({
                name: 'analyze-analyze',
                params: {
                  spaceId: spaceInfo?.id,
                },
              })
            "
            type="primary"
            secondary
          >
            <template #icon>
              <n-icon :component="PieChartOutline" />
            </template>
            空间分析
          </n-button>
          <n-button
            @click="
              $router.push({
                name: 'picture-upload',
                query: {
                  space_id: spaceInfo?.id,
                  space_name: spaceInfo?.spaceName,
                  space_type: spaceInfo?.spaceType,
                },
              })
            "
            type="primary"
            secondary
          >
            <template #icon>
              <n-icon :component="CloudUploadOutline" />
            </template>
            上传图片
          </n-button>
          <n-button
            @click="
              $router.push({
                name: 'picture-upload-batch',
                query: {
                  space_id: spaceInfo?.id,
                  space_name: spaceInfo?.spaceName,
                },
              })
            "
            type="primary"
          >
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
              >存储空间: {{ formatSize(spaceInfo?.usedSize as number) }} /
              {{ formatSize(spaceInfo?.maxSize as number) }}
            </n-text>
            <n-progress
              type="line"
              :percentage="((spaceInfo?.usedSize / spaceInfo?.maxSize) * 100).toFixed(1)"
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
              :percentage="((spaceInfo?.usedCount / spaceInfo?.maxCount) * 100).toFixed(1)"
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
              <n-input
                v-model:value="searchParams.picName"
                placeholder="请输入图片名称"
                clearable
              />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-form-item label="图片分类" label-placement="left">
              <n-select
                v-model:value="searchParams.categoryId"
                :options="categoryToOptions(categoryList)"
                placeholder="请选择分类"
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
          <n-gi span="4 m:2 l:2">
            <n-form-item label="上传日期" label-placement="left">
              <n-date-picker
                type="daterange"
                clearable
                style="width: 100%"
                :on-confirm="onConfirmRange"
                :on-clear="onClearRange"
                v-model:value="dateRange"
              />
            </n-form-item>
          </n-gi>
          <n-gi span="4 m:2 l:1">
            <n-form-item label="颜色搜索" label-placement="left">
              <color-picker format="hex" @pureColorChange="onColorChange" />
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
      <BPictureList
        v-if="pictureList?.length > 0"
        :space-info="spaceInfo"
        :picture-list="pictureList"
        @picture-deleted="handlePictureDeleted"
      />
      <n-card :bordered="false" v-else>
        <n-empty size="large" description="你什么也找不到" style="width: 100%; height: 100%">
          <template #extra>
            <n-button
              size="small"
              @click="
                $router.push({
                  name: 'picture-upload',
                  query: {
                    space_id: spaceInfo?.id,
                    space_name: spaceInfo?.spaceName,
                    space_type: spaceInfo?.spaceType,
                  },
                })
              "
            >
              上传图片
            </n-button>
          </template>
        </n-empty> </n-card
      ><!--分页-->
    </n-flex>
    <div style="margin-top: 20px"></div>
    <n-flex justify="end">
      <n-pagination
        v-show="pictureList?.length > 0"
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
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { PaginationInfo } from 'naive-ui'
import { useThemeVars } from 'naive-ui'
import {
  getPicturePageListAsPersonSpaceUsingPost,
  searchPictureByPicColorUsingPost,
} from '@/api/pictureController.ts'
import {
  getPrivateSpaceDetailByLoginUserUsingGet,
  switchSpaceContextUsingPost,
} from '@/api/spaceController.ts'
import {
  AlbumsOutline,
  CloudUploadOutline,
  PieChartOutline,
  RefreshOutline,
  SearchOutline,
} from '@vicons/ionicons5'
import { categoryToOptions, formatSize } from '@/utils/util.ts'
import { listHomeCategoriesUsingGet } from '@/api/homeController.ts'
import { PIC_FORMAT_OPTION } from '@/constants/picture.ts'
import { changeColor } from 'seemly'
import dayjs from 'dayjs'
import BPictureList from '@/pages/picture/components/BPictureList.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

const themeVars = useThemeVars()
const dateRange = ref<[string, string] | null>()
const spaceInfo = ref<API.SpaceDetailVO>()
const pictureList = ref<API.PictureVO[]>()

// 定义搜索参数的初始状态
const initialSearchParams: API.PictureQueryRequest = {
  current: 1,
  pageSize: 10,
  picName: null,
  tags: null,
  categoryId: null,
  startEditTime: null,
  endEditTime: null,
  originFormat: null,
}

// 初始化
const searchParams = ref<API.PictureQueryRequest>(structuredClone(initialSearchParams))

// 分页配置
const pagination = reactive({
  page: searchParams.value.current ?? 1,
  pageSize: searchParams.value.pageSize ?? 10,
  itemCount: 0,
})

/**
 * 确认日期的回调 并且转换后端接收格式
 * @param range
 */
const onConfirmRange = (range: [number, number]) => {
  if (range.length < 2) return
  searchParams.value.startEditTime = dayjs(range[0]).format('YYYY-MM-DD HH:mm:ss')
  searchParams.value.endEditTime = dayjs(range[1]).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 清除日期时的回调
 */
const onClearRange = () => {
  searchParams.value.startEditTime = undefined
  searchParams.value.endEditTime = undefined
}

const fetchPictureList = async () => {
  // 设置当前搜索模式为常规
  currentSearchMode.value = 'regular'
  activeColor.value = null

  const { data } = await getPicturePageListAsPersonSpaceUsingPost({
    ...searchParams.value,
    current: pagination.page,
    pageSize: pagination.pageSize,
  })
  if (data && data.records.length > 0) {
    pictureList.value = data.records
    pagination.itemCount = data.total as number
  } else {
    pictureList.value = []
    pagination.itemCount = 0
  }
}

type SearchMode = 'regular' | 'color'

// 由于这里是两个不同的逻辑  引入状态变量来判断当前是哪种搜索模式，默认为常规搜索
const currentSearchMode = ref<SearchMode>('regular')
// 保存当前颜色，用于颜色模式下的分页
const activeColor = ref<string | null>(null)

/**
 * 执行主色调搜索
 * @param color
 */
const executeColorSearch = async (color: string) => {
  currentSearchMode.value = 'color' // 设置当前搜索模式为颜色独立搜索
  activeColor.value = color // 保存当前活跃颜色

  //因为是独立的api 清空其他搜索条件
  searchParams.value = structuredClone(initialSearchParams)
  dateRange.value = null

  const { data } = await searchPictureByPicColorUsingPost({
    picColor: color,
    spaceId: spaceInfo.value?.id,
    current: pagination.page,
    pageSize: pagination.pageSize,
  })
  if (data && data.records) {
    pictureList.value = data.records
    pagination.itemCount = data.total as number
  } else {
    pictureList.value = []
    pagination.itemCount = 0
  }
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page

  if (currentSearchMode.value === 'regular') {
    // 如果是常规搜索模式，调用常规列表获取
    fetchPictureList()
  } else if (currentSearchMode.value === 'color' && activeColor.value) {
    // 如果是颜色搜索模式，并且有活跃的颜色，重新执行颜色搜索
    console.log(page)
    executeColorSearch(activeColor.value)
  }
}

const fetchSpaceInfo = async () => {
  const { data } = await getPrivateSpaceDetailByLoginUserUsingGet()
  if (data) {
    spaceInfo.value = data
    //还需要进行空间登录
    await switchSpaceContextUsingPost({ spaceId: spaceInfo.value.id })
  }
}

//重置搜索条件 (重置默认常规搜索)
const handleResetSearchParma = async () => {
  currentSearchMode.value = 'regular'
  activeColor.value = null
  searchParams.value = structuredClone(initialSearchParams)
  dateRange.value = null
  pagination.page = 1
  await fetchPictureList()
}

const categoryList = ref<API.CategoryVO[]>()

/**
 * 主色调搜索
 * @param color
 */
const onColorChange = async (color: string) => {
  await executeColorSearch(color)
}

// 当子组件发出 'picture-deleted' 事件时调用的函数
const handlePictureDeleted = () => {
  // 当有图片删除时，根据当前模式重新获取列表
  if (currentSearchMode.value === 'regular') {
    fetchPictureList()
  } else if (currentSearchMode.value === 'color' && activeColor.value) {
    executeColorSearch(activeColor.value)
  } else {
    fetchPictureList()
  }
}

onMounted(async () => {
  await fetchSpaceInfo()
  await fetchPictureList()
  const { data } = await listHomeCategoriesUsingGet()
  categoryList.value = data
})
</script>
<style scoped></style>
