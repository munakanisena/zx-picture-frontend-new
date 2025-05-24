<template>
  <div style="padding: 24px">
    <n-card title="用户管理">
      <!-- 搜索区域 -->
      <n-space vertical>
        <n-space>
          <n-input
            v-model:value="searchParams.username"
            placeholder="请输入用户名搜索"
            clearable
            style="width: 200px"
          />
          <n-input
            v-model:value="searchParams.userEmail"
            placeholder="请输入用户邮箱搜索"
            clearable
            style="width: 200px"
          />
          <n-select
          v-model:value="searchParams.userRole"
          :options="userOptions"
          placeholder="用户权限"
          clearable
          style="width: 120px"
        />
          <n-select
            v-model:value="searchParams.isVip"
            :options="vipOptions"
            placeholder="会员状态"
            clearable
            style="width: 120px"
          />
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <n-icon><search /></n-icon>
            </template>
            搜索
          </n-button>
          <n-button @click="handleReset">
            <template #icon>
              <n-icon><refresh /></n-icon>
            </template>
            重置
          </n-button>
        </n-space>
        <!-- 用户列表 -->
        <n-data-table
          :columns="columns"
          :data="userList"
          :pagination="pagination"
          :loading="loading"
          @update:page="handlePageChange"
        />
      </n-space>
    </n-card>
    <UserUpdate
      :user-data="currentUser"
      ref="userUpdateModalRef"
      :refresh="fetchUserList"
    />
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, onMounted } from 'vue'
import {
  NCard,
  NSpace,
  NInput,
  NButton,
  NSelect,
  NDataTable,
  NIcon,
  NTag,
  NImage,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import { Search, Refresh } from '@vicons/ionicons5'
import { deleteUserUsingPost, getUserDetailByIdUsingGet, getUserPageListAsManageUsingPost } from '@/api/userController'
import UserUpdate from '@/pages/admin/componets/UserUpdate.vue'

const message = useMessage()
const loading = ref(false)
const userList = ref<API.UserVO[]>([])

// 搜索参数
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
})

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
})

// 会员状态选项 todo 考虑使用 enum 通用获取选项
const vipOptions = [
  { label: '普通用户', value: 0 },
  { label: '会员用户', value: 1 },
]

// 用户状态选项 todo 考虑使用 enum 通用获取选项
const userOptions = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' },
]

// 表格列配置
const columns: DataTableColumns<API.UserVO> = [
  {
    title: '用户ID',
    key: 'id',
    width: 125,
  },
  {
    title: '头像',
    key: 'userAvatar',
    width: 80,
    render(row) {
      return h(NImage, {
        src: row.userAvatar,
        width: 48,
        height: 48,
        style: {
          borderRadius: '50%',
        },
      })
    },
  },
  {
    title: '用户名',
    key: 'username',
    width: 90,
  },
  {
    title: '邮箱',
    key: 'userEmail',
    width: 150,
  },
  {
    title: '会员状态',
    key: 'isVip',
    width: 80,
    render(row) {
      return h(
        NTag,
        {
          type: row.isVip ? 'success' : 'default',
        },
        { default: () => (row.isVip ? '会员' : '普通用户') },
      )
    },
  },
  {
    title: '会员编号',
    key: 'vipNumber',
    width: 80,
    render(row) {
      return row.vipNumber || '-'
    },
  },
  {
    title: '用户角色',
    key: 'userRole',
    width: 80,
    render(row) {
      return h(
        NTag,
        {
          type: row.userRole === 'admin' ? 'error' : 'info',
        },
        { default: () => (row.userRole === 'admin' ? '管理员' : '普通用户') },
      )
    },
  },
  {
    title: '账号状态',
    key: 'isDisabled',
    width: 80,
    render(row) {
      return h(
        NTag,
        {
          type: row.isDisabled ? 'error' : 'success',
        },
        { default: () => (row.isDisabled ? '已禁用' : '正常') },
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
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

// 获取用户列表
const fetchUserList=async ()=> {
  loading.value = true
    const {data} = await getUserPageListAsManageUsingPost({
      ...searchParams,
      current: pagination.page,
      pageSize: pagination.pageSize,
    })
    if (data) {
      userList.value = data.records || []
      pagination.itemCount = data.total || 0
    }
    loading.value = false
}

const userUpdateModalRef=ref()
const currentUser = ref<API.UserVO>()
// 编辑用户
const handleEdit=async (row: API.UserVO)=> {
  try {
    const {data} = await getUserDetailByIdUsingGet({ userId: row.id })
    if (data) {
      currentUser.value = data
      userUpdateModalRef.value.openModal()
    }
  } catch (error) {
    message.error('获取用户详情失败')
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchUserList()
}

// 重置
function handleReset() {
  searchParams.username = ''
  searchParams.userRole=''
  searchParams.userEmail=''
  searchParams.isVip=null
  pagination.page = 1
  fetchUserList()
}

// 分页变化
function handlePageChange(page: number) {
  pagination.page = page
  fetchUserList()
}

/**
 * 删除用户
 * @param user
 */
const deleteUser= async (user:API.UserVO)=>{
  await deleteUserUsingPost({
    id:user.id
  })
  message.success('删除成功')
  await fetchUserList()
}

// 初始化
onMounted(()=>{
  fetchUserList()
})

</script>

