<template>
  <div style="padding: 24px">
    <n-flex align="center" justify="space-between" style="height: 100%">
      <n-h1>空间管理</n-h1>
      <n-button-group>
        <n-space>
          <n-button
            @click="
              $router.push({
                name: 'analyze-analyze',
                params: {
                  spaceId: 0,
                },
                query: {
                  queryAll: 1,
                },
              })
            "
            type="primary"
            secondary
          >
            <template #icon>
              <n-icon :component="PieChartOutline" />
            </template>
            全空间分析
          </n-button>
          <n-button
            @click="
              $router.push({
                name: 'analyze-analyze',
                params: {
                  spaceId: 0,
                },
                query: {
                  queryPublic: 1,
                },
              })
            "
            type="primary"
            secondary
          >
            <template #icon>
              <n-icon :component="PieChartOutline" />
            </template>
            公共空间分析
          </n-button>
        </n-space>
      </n-button-group>
    </n-flex>
    <n-divider />
    <!--搜索栏-->
    <n-card :bordered="false">
      <n-grid :x-gap="12" :cols="5" item-responsive responsive="screen">
        <n-gi span="4 m:2 l:1">
          <n-form-item label="空间名称" label-placement="left">
            <n-input
              v-model:value="searchParams.spaceName"
              placeholder="请输入空间名称"
              clearable
            />
          </n-form-item>
        </n-gi>
        <n-gi span="4 m:2 l:1">
          <n-form-item label="用户ID" label-placement="left">
            <n-input v-model:value="searchParams.userId" placeholder="请输入用户ID" clearable />
          </n-form-item>
        </n-gi>
        <n-gi span="4 m:2 l:1">
          <n-form-item label="空间类型" label-placement="left">
            <n-select
              v-model:value="searchParams.spaceType"
              :options="toOptions(SPACE_TYPE_MAP)"
              placeholder="请输入空间类型"
            />
          </n-form-item>
        </n-gi>
        <n-gi span="4 m:2 l:1">
          <n-form-item label="空间级别" label-placement="left">
            <n-select
              v-model:value="searchParams.spaceLevel"
              :options="toOptions(SPACE_LEVEL_MAP)"
              placeholder="请选择空间级别"
              clearable
            />
          </n-form-item>
        </n-gi>
        <n-gi span="4 m:2 l:1">
          <n-space>
            <n-button type="primary" @click="handleSearch">
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
    <div style="height: 16px"></div>
    <n-data-table
      remote
      :columns="columns"
      :data="spaceVOList"
      size="large"
      :loading="loading"
      :pagination="pagination"
      @update:page="handlePageChange"
    ></n-data-table>
  </div>
  <BSpaceUpdateModal
    v-if="!!currentSpace"
    :current-space="currentSpace"
    :refresh="fetchSpaceList"
    ref="space-update-modal"
  />
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref, useTemplateRef } from 'vue'
import {
  type DataTableColumns,
  NButton,
  NIcon,
  NInput,
  NSelect,
  NSpace,
  NTag,
  useMessage,
} from 'naive-ui'
import { PieChartOutline, RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { toOptions } from '@/utils/util.ts'
import { SPACE_LEVEL_MAP, SPACE_TYPE_MAP } from '@/constants/space.ts'
import { deleteSpaceUsingPost, getSpacePageListAsManageUsingPost } from '@/api/spaceController.ts'
import BSpaceUpdateModal from '@/pages/admin/components/BSpaceUpdateModal.vue'
import { useRouter } from 'vue-router'

const message = useMessage()
const loading = ref(false)
const spaceVOList = ref<API.SpaceVO[]>()
const loadingBar = useLoadingBar()
const router = useRouter()
const spaceUpdateModal = useTemplateRef('space-update-modal')

// 定义搜索参数的初始状态
const initialSearchParams: API.SpaceQueryRequest = {
  current: 1,
  pageSize: 10,
  spaceName: null,
  spaceType: null,
  spaceLevel: null,
  userId: null,
}

// 初始化
const searchParams = ref<API.SpaceQueryRequest>({ ...initialSearchParams })

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `共${itemCount}条`
  },
})

/**
 * 获取图片列表
 */
function handleSearch() {
  pagination.page = 1
  fetchSpaceList()
}

const fetchSpaceList = async () => {
  loadingBar.start()
  const { data } = await getSpacePageListAsManageUsingPost({
    ...searchParams.value,
    current: pagination.page,
    pageSize: pagination.pageSize,
  })
  if ((data.records?.length as number) < 0) return
  spaceVOList.value = data.records
  pagination.itemCount = data.total as number
  loadingBar.finish()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchSpaceList()
}

//删除图片
const clickDelete = async (SpaceId: number) => {
  await deleteSpaceUsingPost({ id: SpaceId })
  await fetchSpaceList()
  message.success('删除成功')
}

const currentSpace = ref<API.SpaceVO>()
//编辑空间
const editSpace = async (space: API.SpaceVO) => {
  currentSpace.value = space
  //等待组件挂载完毕
  await nextTick()
  spaceUpdateModal.value?.openUpdateModal()
}

//重置搜索条件
const handleResetSearchParma = async () => {
  searchParams.value = { ...initialSearchParams }
  pagination.page = 1
  await fetchSpaceList()
}

onMounted(() => {
  fetchSpaceList()
})

// 表格列配置
const columns: DataTableColumns<API.SpaceVO> = [
  {
    title: '空间id',
    key: 'id',
  },
  {
    title: '空间名称',
    key: 'spaceName',
  },
  {
    title: '用户id',
    key: 'userId',
  },
  {
    title: '空间级别',
    key: 'spaceLevel',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: () => {
            return SPACE_LEVEL_MAP[row.spaceLevel as number]
          },
        },
      )
    },
  },
  {
    title: '空间类型',
    key: 'spaceType',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: () => {
            return SPACE_TYPE_MAP[row.spaceType as number]
          },
        },
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'info',
                secondary: true,
                onClick: () => {
                  router.push({
                    name: 'analyze-analyze',
                    params: {
                      spaceId: row?.id,
                    },
                  })
                },
              },
              { default: () => '空间分析' },
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                secondary: true,
                onClick: () => editSpace(row),
              },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                secondary: true,
                onClick: () => clickDelete(row.id as number),
              },
              { default: () => '删除' },
            ),
          ],
        },
      )
    },
  },
]
</script>
<style scoped></style>
