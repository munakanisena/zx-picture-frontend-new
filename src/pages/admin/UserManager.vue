<template>
  <div style="padding: 24px">
    <!-- 搜索区域 -->
    <n-h1>用户管理</n-h1>
    <n-divider />
    <n-flex align="center">
      <n-input
        v-model:value="searchParams.name"
        placeholder="请输入用户名搜索"
        clearable
        style="width: 200px"
      />
      <n-input
        v-model:value="searchParams.email"
        placeholder="请输入用户邮箱搜索"
        clearable
        style="width: 200px"
      />
      <n-select
        v-model:value="searchParams.role"
        :options="toOptions(USER_ROLE_MAP)"
        placeholder="用户权限"
        clearable
        style="width: 120px"
      />
      <n-select
        v-model:value="searchParams.isVip"
        :options="toOptions(USER_VIP_MAP)"
        placeholder="会员状态"
        clearable
        style="width: 120px"
      />
      <n-select
        v-model:value="searchParams.isDisabled"
        :options="toOptions(USER_STATE_MAP)"
        placeholder="用户状态"
        clearable
        style="width: 120px"
      />
      <n-button type="primary" @click="handleSearch">
        <template #icon>
          <n-icon>
            <search />
          </n-icon>
        </template>
        搜索
      </n-button>
      <n-button @click="handleResetSearchParma">
        <template #icon>
          <n-icon>
            <refresh />
          </n-icon>
        </template>
        重置
      </n-button>
    </n-flex>
    <div style="height: 16px"></div>
    <n-data-table
      remote
      :columns="columns"
      :data="userList"
      size="large"
      :loading="loading"
      :pagination="pagination"
      @update:page="handlePageChange"
    ></n-data-table>
    <BUserUpdateModal
      v-if="!!currentUser"
      :currentUser="currentUser"
      ref="user-update-modal-ref"
      :refresh="fetchUserList"
    />
  </div>
</template>

<script setup lang="ts">
import { h, nextTick, onMounted, reactive, ref, useTemplateRef } from 'vue'
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
import { Refresh, Search } from '@vicons/ionicons5'
import { deleteUserUsingPost, getUserPageListAsManageUsingPost } from '@/api/userController'
import BUserUpdateModal from '@/pages/admin/components/BUserUpdateModal.vue'
import { toOptions } from '@/utils/util.ts'
import { USER_ROLE_MAP, USER_STATE_MAP, USER_VIP_MAP } from '@/constants/user.ts'
import dayjs from 'dayjs'

const message = useMessage()
const loading = ref(false)
const userList = ref<API.UserVO[]>([])

// 定义搜索参数的初始状态
const initialSearchParams: API.UserQueryRequest = {
  current: 1,
  pageSize: 10,
  name: null,
  email: null,
  role: null,
  isDisabled: null,
  isVip: null,
}

// 初始化
const searchParams = ref<API.UserQueryRequest>({ ...initialSearchParams })

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `共${itemCount}条`
  },
})

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  const { data } = await getUserPageListAsManageUsingPost({
    ...searchParams.value,
    current: pagination.page,
    pageSize: pagination.pageSize,
  })
  if (data) {
    userList.value = data.records || []
    pagination.itemCount = data.total as number
  }
  loading.value = false
}

const userUpdateModalRef = useTemplateRef('user-update-modal-ref')
const currentUser = ref<API.UserVO>()

// 编辑用户
const handleEdit = async (userVO: API.UserVO) => {
  currentUser.value = userVO
  //等待组件挂载完毕
  await nextTick()
  userUpdateModalRef.value?.openUpdateModal()
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchUserList()
}

//重置搜索条件
const handleResetSearchParma = async () => {
  searchParams.value = structuredClone(initialSearchParams)
  pagination.page = 1
  await fetchUserList()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchUserList()
}

/**
 * 删除用户
 * @param userInfo
 */
const deleteUser = async (userInfo: API.UserVO) => {
  await deleteUserUsingPost({
    id: userInfo.id,
  })
  message.success('删除成功')
  await fetchUserList()
}

// 初始化
onMounted(() => {
  fetchUserList()
})

// 表格列配置
const columns: DataTableColumns<API.UserVO> = [
  {
    title: '用户ID',
    key: 'id',
  },
  {
    title: '头像',
    key: 'avatar',
    render(row) {
      return h(NImage, {
        src: row.avatar ?? 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        width: 64,
        height: 64,
        style: {
          borderRadius: '50%',
        },
      })
    },
  },
  {
    title: '用户名',
    key: 'name',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '会员状态',
    key: 'isVip',
    render(row) {
      return h(
        NTag,
        {
          type: row.isVip ? 'success' : 'default',
        },
        { default: () => USER_VIP_MAP[row.isVip as number] },
      )
    },
  },
  {
    title: '会员编号',
    key: 'vipNumber',
    render(row) {
      return row.vipNumber || '-'
    },
  },
  {
    title: '用户角色',
    key: 'role',
    render(row) {
      return h(
        NTag,
        {
          type: row.role === 'admin' ? 'error' : 'info',
        },
        { default: () => USER_ROLE_MAP[row.role as string] },
      )
    },
  },
  {
    title: '账号状态',
    key: 'isDisabled',
    render(row) {
      return h(
        NTag,
        {
          type: row.isDisabled ? 'error' : 'success',
        },
        { default: () => USER_STATE_MAP[row.isDisabled as number] },
      )
    },
  },
  {
    title: '创建时间',
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
                onClick: () => handleEdit(row),
              },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: () => deleteUser(row),
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
