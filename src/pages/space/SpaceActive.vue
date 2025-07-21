<template>
  <div style="padding: 32px">
    <n-card title="激活空间" style="max-width: 700px; margin: 0 auto">
      <n-blockquote style="margin-bottom: 24px">
        目前暂未开通{{ spaceType && spaceType == 2 ? '团队' : '个人' }}空间，请先开通{{
          spaceType && spaceType == 2 ? '团队' : '个人'
        }}空间
      </n-blockquote>
      <n-input
        v-model:value="spaceName"
        type="text"
        placeholder="请输入空间名称"
        style="margin-bottom: 16px"
        @keydown.enter="activateSpace"
      />
      <n-button type="primary" style="width: 100%" @click="activateSpace">激活</n-button>
      <n-blockquote style="margin-top: 24px">
        <n-h2>空间等级介绍</n-h2>
        <n-text>目前仅支持开通普通版</n-text>
        <n-p v-for="spaceLevel in SPACE_LEVEL_LIST" :key="spaceLevel.text">
          {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
          {{ spaceLevel.maxCount }}
        </n-p>
      </n-blockquote>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { activeSpaceUsingPost } from '@/api/spaceController.ts'
import { computed, onMounted, ref } from 'vue'
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_LIST, SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { formatSize } from '@/utils/util.ts'

const { type, from } = defineProps<{ type: number; from: string }>()

const spaceName = ref<string>()
const router = useRouter()
const message = useMessage()

// 空间类别 否则默认私有空间
const spaceType = computed(() => {
  if (type) {
    return Number(type)
  }
  return SPACE_TYPE_ENUM.PRIVATE
})

//激活空间
const activateSpace = async () => {
  const { data } = await activeSpaceUsingPost({
    spaceName: spaceName.value,
    spaceType: spaceType.value,
    spaceLevel: SPACE_LEVEL_ENUM.COMMON,
  })
  if (data) {
    message.success('空间激活成功')
    if (from) {
      await router.replace(from)
    } else {
      await router.replace('/')
    }
  }
}

onMounted(() => {
  useLoginUserStore().checkLogin()
})
</script>

<style scoped></style>
