<template>
  <div style="padding: 12px">
    <n-space vertical :size="12">
      <n-card title="🚀 团队空间详情" :bordered="false" :style="{ borderRadius: '8px' }">
        <n-descriptions label-placement="left" :column="1">
          <n-descriptions-item label="空间名称"> {{ teamInfo?.spaceName }}</n-descriptions-item>
          <n-descriptions-item label="空间详情">
            存储空间: {{ formatSize(teamInfo?.usedSize as number) }} /
            {{ formatSize(teamInfo?.maxSize as number) }}
            存储数量: {{ teamInfo?.usedCount }} / {{ teamInfo?.maxCount }} 张
          </n-descriptions-item>
          <n-descriptions-item label="创建日期">
            {{ formatDistanceToNow(teamInfo?.createTime as string) }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-card title="👥 空间成员" :bordered="false" :style="{ borderRadius: '8px' }">
        <n-space
          v-if="loginUserMember?.spaceRole === SPACE_ROLE_ENUM.ADMIN"
          :size="12"
          style="margin-bottom: 20px; padding: 8px"
        >
          <n-input v-model:value="newMemberId" placeholder="请输入要添加的用户ID" clearable />
          <n-select
            v-model:value="newMemberRole"
            :options="toOptions(SPACE_ROLE_MAP)"
            placeholder="请选择角色"
            style="width: 150px"
          />
          <n-button type="primary" @click="handleAddMember">
            <template #icon>
              <n-icon>
                <AddIcon />
              </n-icon>
            </template>
            添加成员
          </n-button>
        </n-space>

        <n-list hoverable clickable bordered>
          <n-list-item v-for="member in teamMembers" :key="member.id">
            <template #prefix>
              <n-avatar
                round
                :src="member.userDetailVO?.avatar"
                :size="48"
                :style="{ marginRight: '16px' }"
              />
            </template>
            <!--这里展示的id就是用户id,不是空间角色id-->
            <n-thing
              :title="member.userDetailVO?.name"
              :description="`ID: ${member.userDetailVO?.id}`"
            />
            <template #suffix>
              <n-space align="center">
                <n-select
                  :value="member.spaceRole"
                  :options="toOptions(SPACE_ROLE_MAP)"
                  @update:value="(newRoleValue) => handleRoleChange(member.id, newRoleValue)"
                  :disabled="loginUserMember?.spaceRole !== SPACE_ROLE_ENUM.ADMIN"
                  style="width: 120px"
                />
                <n-button
                  v-if="loginUserMember?.spaceRole === SPACE_ROLE_ENUM.ADMIN"
                  @click="handleDeletedMember(member.id as any)"
                  style="width: 120px"
                >
                  <template #icon>
                    <n-icon>
                      <RemoveIcon />
                    </n-icon>
                  </template>
                  删除成员
                </n-button>
              </n-space>
            </template>
          </n-list-item>
        </n-list>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSpaceDetailBySpaceIdUsingGet } from '@/api/spaceController'
import { formatSize, toOptions } from '@/utils/util.ts'
import { formatDistanceToNow } from '@/utils/formatDistanceToNow.ts'
import { SPACE_ROLE_ENUM, SPACE_ROLE_MAP } from '@/constants/space.ts'
import { useMessage } from 'naive-ui'
import { Add as AddIcon, TrashOutline as RemoveIcon } from '@vicons/ionicons5'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  getTeamSpaceMembersBySpaceIdUsingGet,
} from '@/api/spaceUserController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const teamInfo = ref<API.SpaceTeamDetailVO>()
const teamMembers = ref<API.SpaceUserVO[]>([])
const newMemberId = ref<string>('')
const newMemberRole = ref()
const message = useMessage()
const loginUserMember = ref<API.SpaceUserVO>()
const { spaceId } = defineProps<{ spaceId: string }>()

const fetchSpaceUserVO = async () => {
  const { data } = await getTeamSpaceMembersBySpaceIdUsingGet({ spaceId: spaceId as any })
  teamMembers.value = data ?? []
  loginUserMember.value = teamMembers.value.find(
    (item) => item.userDetailVO?.id === useLoginUserStore().userInfo.id,
  )
}

const fetchTeamInfo = async () => {
  const { data } = await getSpaceDetailBySpaceIdUsingGet({ spaceId: spaceId as any })
  teamInfo.value = data ?? {}
}

// 处理添加成员逻辑
const handleAddMember = async () => {
  if (!newMemberId.value || !newMemberRole.value) {
    message.error('请输入用户ID并选择一个角色')
    return
  }
  if (!teamInfo.value?.id) {
    message.error('无法获取空间ID，请刷新页面')
    return
  }
  await addSpaceUserUsingPost({
    userId: newMemberId.value as any,
    spaceId: teamInfo.value.id,
    spaceRole: newMemberRole.value as string,
  })
  message.success('添加成功')
  newMemberId.value = ''
  newMemberRole.value = null
  await fetchSpaceUserVO()
}

// 处理更新角色逻辑
const handleRoleChange = async (memberId: string, spaceRole: string) => {
  await editSpaceUserUsingPost({ id: memberId, spaceId: teamInfo.value?.id, spaceRole: spaceRole })
  message.success('角色更新成功')
  await fetchSpaceUserVO()
}

// 处理移除成员逻辑
const handleDeletedMember = async (spaceUserId: string) => {
  if (!spaceUserId) {
    message.error('无法获取成员ID，请刷新页面')
    return
  }
  await deleteSpaceUserUsingPost({ id: spaceUserId as any, spaceId: teamInfo.value?.id })
  message.success('移除成员成功')
  await fetchSpaceUserVO()
}

onMounted(() => {
  fetchSpaceUserVO()
  fetchTeamInfo()
})
</script>

<style scoped></style>
