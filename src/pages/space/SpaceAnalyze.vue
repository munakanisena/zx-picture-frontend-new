<template>
  <div style="padding: 24px">
    <BSpaceAnalyzeUsage :space-id="spaceId" :query-all="!!queryAll" :query-public="!!queryPublic" />
    <BSpaceAnalyzeCategory
      :space-id="spaceId"
      :query-all="!!queryAll"
      :query-public="!!queryPublic"
    />
    <n-flex justify="center" size="large">
      <BSpaceAnalyzeTag :space-id="spaceId" :query-all="!!queryAll" :query-public="!!queryPublic" />
      <BSpaceAnalyzeSize :space-id="spaceId" :queryAll="!!queryAll" :query-public="!!queryPublic" />
    </n-flex>
    <BSpaceAnalyzeAction />
    <BSpaceAnalyzeRank v-if="isAdmin" />
  </div>
</template>
<script setup lang="ts">
import BSpaceAnalyzeUsage from '@/pages/space/components/BSpaceAnalyzeUsage.vue'
import BSpaceAnalyzeCategory from '@/pages/space/components/BSpaceAnalyzeCategory.vue'
import BSpaceAnalyzeSize from '@/pages/space/components/BSpaceAnalyzeSize.vue'
import BSpaceAnalyzeTag from '@/pages/space/components/BSpaceAnalyzeTag.vue'
import BSpaceAnalyzeRank from '@/pages/space/components/BSpaceAnalyzeRank.vue'
import BSpaceAnalyzeAction from '@/pages/space/components/BSpaceAnalyzeAction.vue'
import { computed } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { USER_ROLE_ENUM } from '@/constants/user.ts'

const { spaceId, queryAll, queryPublic } = defineProps<{
  spaceId?: string
  queryAll?: number
  queryPublic?: number
}>()

const isAdmin = computed(() => {
  return useLoginUserStore().userInfo.role === USER_ROLE_ENUM.ADMIN
})
</script>
<style scoped></style>
