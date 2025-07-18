<template>
  <div style="padding: 24px">
    <BSpaceAnalyzeUsage :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic" />
    <BSpaceAnalyzeCategory :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic" />
    <n-flex justify="center" size="large">
      <BSpaceAnalyzeTag :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic" />
      <BSpaceAnalyzeSize :space-id="spaceId" :queryAll="queryAll" :query-public="queryPublic" />
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
import { useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const route = useRoute()

// 空间 id
const spaceId = computed(() => {
  return route.query?.space_id as string
})

// 是否查询所有空间
const queryAll = computed(() => {

  return !!Number(route.query?.queryAll)
})

// 是否查询公共空间
const queryPublic = computed(() => {
  return !!Number(route.query?.queryPublic)
})

const userStore = useLoginUserStore()
const userInfo = userStore.userInfo

const isAdmin =computed(()=>{
  return userInfo.role === 'admin'
})


</script>
<style scoped></style>
