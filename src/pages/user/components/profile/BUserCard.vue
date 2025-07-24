<template>
  <div style="width: 100%; margin: 0 auto">
    <n-card style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 16px; height: 100%">
      <template #header style="padding: 32rem">
        <n-flex vertical justify="center" align="center" :size="[0]">
          <n-avatar
            v-if="userInfo.avatar"
            :src="userInfo.avatar"
            style="width: 128px; height: 128px; overflow: hidden"
            round
          >
          </n-avatar>
          <n-icon :size="128" v-else :component="PersonCircleOutline"></n-icon>
          <n-h4 style="font-size: 24px; font-weight: 700">{{ userInfo.name }}</n-h4>
          <n-tag :type="userInfo.role === 'admin' ? 'error' : 'success'">
            {{ USER_ROLE_MAP[userInfo.role] }}
          </n-tag>
        </n-flex>
      </template>
      <n-flex vertical>
        <n-flex align="center">
          <JoinIcon style="height: 16px; width: 16px" />
          <span>加入于{{ formatDistanceToNow(userInfo.createTime as string) }}</span>
        </n-flex>
        <n-flex align="center">
          <IntroduceIcon style="height: 16px; width: 16px" />
          {{ userInfo.introduction || '你还没有设置签名哟' }}
        </n-flex>
      </n-flex>
      <n-divider />
      <BUserButton />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import {
  CalendarClearOutline as JoinIcon,
  DocumentTextOutline as IntroduceIcon,
  PersonCircleOutline,
} from '@vicons/ionicons5'
import BUserButton from '@/pages/user/components/profile/BUserButton.vue'
import { formatDistanceToNow } from '@/utils/formatDistanceToNow.ts'
import { USER_ROLE_MAP } from '@/constants/user.ts'

const userInfo = useLoginUserStore().userInfo
</script>

<style scoped></style>
