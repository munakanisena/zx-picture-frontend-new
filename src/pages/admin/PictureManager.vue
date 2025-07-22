<template>
  <div style="padding: 24px">
    <n-flex justify="space-between" align="center">
      <n-h1>图片管理</n-h1>
      <n-button type="info" size="large" @click="$router.push({ name: 'picture-capture' })"
        >抓取图片
      </n-button>
    </n-flex>
    <n-divider />
    <!--搜索栏-->
    <n-card :bordered="false">
      <n-grid :x-gap="12" :cols="4" item-responsive responsive="screen">
        <n-gi span="4 m:2 l:1">
          <n-form-item label="图片名称" label-placement="left">
            <n-input v-model:value="searchParams.picName" placeholder="请输入图片名称" clearable />
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
          <n-form-item label="图片标签" label-placement="left">
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
              v-model:value="dateRange"
              style="width: 100%"
              :on-confirm="onConfirmRange"
              :on-clear="onClearRange"
            />
          </n-form-item>
        </n-gi>
        <n-gi span="4 m:2 l:1">
          <n-form-item label="审核状态" label-placement="left">
            <n-select
              v-model:value="searchParams.reviewStatus"
              :options="toOptions(PIC_REVIEW_STATUS_MAP)"
              placeholder="请选择审核状态"
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
      :data="pictureVOList"
      size="large"
      :loading="loading"
      :pagination="pagination"
      @update:page="handlePageChange"
    ></n-data-table>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import {
  type DataTableColumns,
  NButton,
  NIcon,
  NImage,
  NInput,
  NSelect,
  NSpace,
  NTag,
  useMessage,
} from 'naive-ui'
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { categoryToOptions, toOptions } from '@/utils/util.ts'
import {
  PIC_FORMAT_OPTION,
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
} from '@/constants/picture.ts'
import { listHomeCategoriesUsingGet } from '@/api/homeController.ts'
import {
  deletePictureByAdminUsingPost,
  deletePictureByIdUsingPost,
  getPicturePageListAsManageUsingPost,
  reviewPictureUsingPost
} from '@/api/pictureController.ts'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const message = useMessage()
const dateRange = ref<[string, string] | null>()
const loading = ref(false)
const pictureVOList = ref<API.PictureVO[]>()
const loadingBar = useLoadingBar()
const categoryList = ref<API.CategoryVO[]>()
const router = useRouter()

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
  prefix({ itemCount }: any) {
    return `共${itemCount}条`
  },
})

/**
 * 确认日期的回调
 * @param range
 */
const onConfirmRange = (range: [string, string]) => {
  if (range.length < 2) return
  searchParams.value.startEditTime = dayjs(range[0]).format('YYYY-MM-DD HH:mm:ss')
  searchParams.value.endEditTime = dayjs(range[1]).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取图片列表
 */
function handleSearch() {
  pagination.page = 1
  fetchPictureList()
}

/**
 * 清除日期时的回调
 */
const onClearRange = () => {
  searchParams.value.startEditTime = undefined
  searchParams.value.endEditTime = undefined
}

const fetchPictureList = async () => {
  loadingBar.start()
  const { data } = await getPicturePageListAsManageUsingPost({
    ...searchParams.value,
    current: pagination.page,
    pageSize: pagination.pageSize,
  })
  if ((data.records?.length as number) < 0) return
  pictureVOList.value = data.records
  pagination.itemCount = data.total as number
  loadingBar.finish()
}

onMounted(async () => {
  const { data } = await listHomeCategoriesUsingGet()
  categoryList.value = data
})

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchPictureList()
}

//删除图片
const clickDelete = async (pictureId: number) => {
  await deletePictureByAdminUsingPost({ id: pictureId })
  await fetchPictureList()
  message.success('删除成功')
}

//编辑
const editPicture = (pictureVO: API.PictureVO) => {
  router.push({ name: 'picture-edit', params: { pictureId: pictureVO.id } })
}

const reviewPicture = async (pictureVO: API.PictureVO, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus == PIC_REVIEW_STATUS_ENUM.REJECT ? '管理员审核不通过' : '管理员审核通过'
  await reviewPictureUsingPost({
    id: pictureVO.id,
    reviewStatus: reviewStatus,
    reviewMessage: reviewMessage,
  })
  message.success('操作成功')
  await fetchPictureList()
}

//重置搜索条件
const handleResetSearchParma = async () => {
  searchParams.value = structuredClone(initialSearchParams)
  dateRange.value = null
  pagination.page = 1
  await fetchPictureList()
}

onMounted(() => {
  fetchPictureList()
})

// 表格列配置
const columns: DataTableColumns<API.PictureVO> = [
  {
    title: '图片id',
    key: 'id',
  },
  {
    title: '图片名称',
    key: 'picName',
  },
  {
    title: '图片',
    key: 'compressUrl',
    align: 'center',
    render(row) {
      return h(NImage, {
        src: row.compressUrl,
        width: 80,
        height: 80,
        objectFit: 'contain',
      })
    },
  },
  {
    title: '图片分类',
    key: 'pictureCategory',
    render(row) {
      return h(
        NTag,
        {
          type: 'primary',
        },
        row.pictureCategory?.name || '无分类',
      )
    },
  },
  {
    title: '图片标签',
    key: 'tags',
    render(row) {
      return row.tags.map((tagKey) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
              marginBottom: '6px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => tagKey,
          },
        )
      })
    },
  },
  {
    title: '审核状态',
    align: 'center',
    key: 'reviewStatus',
    render(row) {
      return PIC_REVIEW_STATUS_MAP[row.reviewStatus as number]
    },
  },
  {
    title: '上传时间',
    align: 'center',
    key: 'createTime',
    render(row) {
      return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: '编辑时间',
    align: 'center',
    key: 'editTime',
    render(row) {
      return dayjs(row.editTime).format('YYYY-MM-DD HH:mm:ss')
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
                type: 'primary',
                secondary: true,
                onClick: () => editPicture(row),
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
            row.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS
              ? h(
                  NButton,
                  {
                    size: 'small',
                    type: 'info',
                    secondary: true,
                    onClick: () => reviewPicture(row, PIC_REVIEW_STATUS_ENUM.PASS),
                  },
                  {
                    default: () => '通过',
                  },
                )
              : null,
            // 拒绝按钮
            row.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT
              ? h(
                  NButton,
                  {
                    size: 'small',
                    type: 'warning',
                    danger: true,
                    secondary: true,
                    onClick: () => reviewPicture(row, PIC_REVIEW_STATUS_ENUM.REJECT),
                  },
                  { default: () => '拒绝' },
                )
              : null,
          ],
        },
      )
    },
  },
]
</script>
<style scoped></style>
