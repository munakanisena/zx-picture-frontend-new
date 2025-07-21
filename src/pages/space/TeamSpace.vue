<template>
  <div style="padding: 24px">
    <!--个人空间头部-->
    <n-flex align="center" justify="space-between" style="height: 100%">
      <n-h1 style="margin: 0">团队空间({{ teamInfo?.spaceName }})</n-h1>
      <n-button-group>
        <n-space>
          <n-button
            @click="
              $router.push({
                name: 'space-team-member',
                params: { spaceId: teamInfo?.id },
              })
            "
            type="info"
            secondary
          >
            <template #icon>
              <n-icon :component="AccessibilityOutline" />
            </template>
            空间成员列表
          </n-button>
          <n-button
            @click="
              $router.push({
                name: 'analyze-analyze',
                params: {
                  spaceId: teamInfo?.id,
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
                  space_id: teamInfo?.id,
                  space_name: teamInfo?.spaceName,
                  space_type: teamInfo?.spaceType,
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
                  space_id: teamInfo?.id,
                  space_name: teamInfo?.spaceName,
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
              >存储空间: {{ formatSize(teamInfo?.usedSize as number) }} /
              {{ formatSize(teamInfo?.maxSize as number) }}
            </n-text>
            <n-progress
              type="line"
              :percentage="((teamInfo?.usedSize / teamInfo?.maxSize) * 100).toFixed(1)"
              :indicator-placement="'inside'"
              :height="24"
              processing
              :color="themeVars.successColor"
              :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })"
            />
          </div>
          <div>
            <n-text> 存储数量: {{ teamInfo?.usedCount }} / {{ teamInfo?.maxCount }} 张</n-text>
            <n-progress
              type="line"
              :height="24"
              :percentage="((teamInfo?.usedCount / teamInfo?.maxCount) * 100).toFixed(1)"
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
            <n-space>
              <n-button type="primary" @click="fetchTeamPictureList">
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
        :picture-list="pictureList"
        :space-info="teamInfo"
        :login-user-member="loginUserMember"
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
                    space_id: teamInfo?.id,
                    space_name: teamInfo?.spaceName,
                    space_type: teamInfo?.spaceType,
                  },
                })
              "
            >
              上传图片
            </n-button>
          </template>
        </n-empty>
      </n-card>
      <!--分页-->
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

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import {
  getSpaceDetailBySpaceIdUsingGet,
  getTeamSpaceDetailByLoginUserUsingGet,
  switchSpaceContextUsingPost,
} from '@/api/spaceController.ts'
import { categoryToOptions, formatSize } from '@/utils/util.ts'
import { type PaginationInfo, useThemeVars } from 'naive-ui'
import { getPicturePageListAsTeamSpaceUsingPost } from '@/api/pictureController.ts'
import {
  AccessibilityOutline,
  AlbumsOutline,
  CloudUploadOutline,
  PieChartOutline,
  RefreshOutline,
  SearchOutline,
} from '@vicons/ionicons5'
import { changeColor } from 'seemly'
import { PIC_FORMAT_OPTION } from '@/constants/picture.ts'
import BPictureList from '@/pages/picture/components/BPictureList.vue'
import { listHomeCategoriesUsingGet } from '@/api/homeController.ts'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { getTeamSpaceMembersBySpaceIdUsingGet } from '@/api/spaceUserController.ts'

const teamInfo = ref<API.SpaceTeamDetailVO>()
const dateRange = ref<[string, string] | null>()
const pictureList = ref<API.PictureVO[]>()
const themeVars = useThemeVars()
const loginUserMember = ref<API.SpaceUserVO>()
const route = useRoute()
//如果传了ID 就用传递的ID 查询空间。否则就是用户自己的团队空间
const spaceId = ref(route.query.space_id)

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
  page: 1,
  pageSize: 10,
  itemCount: 0,
})

/**
 * 确认日期的回调 并且转换后端接收格式
 * @param range
 */
const onConfirmRange = (range: [string, string]) => {
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

/**
 * 获取团队空间信息
 */
const fetchTeamInfo = async () => {
  if (spaceId.value) {
    const { data } = await getSpaceDetailBySpaceIdUsingGet({ spaceId: spaceId.value })
    teamInfo.value = data
    await switchSpaceContextUsingPost({ spaceId: teamInfo.value.id })
  } else {
    const { data } = await getTeamSpaceDetailByLoginUserUsingGet()
    teamInfo.value = data
    await switchSpaceContextUsingPost({ spaceId: teamInfo.value.id })
  }
}

/**
 * 获取团队空间列表
 */
const fetchSpaceUserVO = async () => {
  const { data } = await getTeamSpaceMembersBySpaceIdUsingGet({ spaceId: teamInfo.value?.id })
  loginUserMember.value = data.find(
    (item) => item.userDetailVO?.id === useLoginUserStore().userInfo.id,
  )
}

/**
 * 获取团队图片分页
 */
const fetchTeamPictureList = async () => {
  //构造请求 如果有空间id就传递
  const requestParams = {
    ...searchParams.value,
    current: pagination.page,
    pageSize: pagination.pageSize,
    spaceId: spaceId.value ? (spaceId.value as any) : null,
  }
  const { data } = await getPicturePageListAsTeamSpaceUsingPost({ ...requestParams })
  if (data && data.records.length > 0) {
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
  fetchTeamPictureList()
}

//重置搜索条件
const handleResetSearchParma = async () => {
  searchParams.value = structuredClone(initialSearchParams)
  dateRange.value = null
  pagination.page = 1
  await fetchTeamPictureList()
}

const categoryList = ref<API.CategoryVO[]>()

// 当子组件发出 'picture-deleted' 事件时调用的函数
const handlePictureDeleted = () => {
  fetchTeamPictureList()
}

onMounted(async () => {
  await fetchTeamInfo()
  await fetchTeamPictureList()
  await fetchSpaceUserVO()
  const { data } = await listHomeCategoriesUsingGet()
  categoryList.value = data
})
</script>
