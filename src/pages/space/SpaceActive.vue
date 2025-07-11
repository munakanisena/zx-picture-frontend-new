<template>
  <n-flex justify="center" style="height: 100%; padding: 20px">
    <n-card title="激活空间" style="height: 500px; width: 100%; max-width: 700px; margin: 0 auto">
      <p>您还没有激活空间</p>
      <n-input
        v-model:value="spaceName"
        type="text"
        placeholder="请输入个人空间名称"
        style="margin-bottom: 16px"
      />
      <n-button type="primary" style="width: 100%" @click="activateSpace">激活</n-button>
    </n-card>
  </n-flex>
</template>
<script setup lang="ts">
import { activeSpaceUsingPost } from '@/api/spaceController.ts'
import { onMounted, ref } from 'vue'
import { SPACE_LEVEL_MAP, SPACE_TYPE_MAP } from '@/constants/space.ts'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
const spaceName = ref<string>()
const router = useRouter()
const message = useMessage()

//激活空间
const activateSpace = async () => {
  const { data } = await activeSpaceUsingPost({
    spaceName: spaceName.value,
    spaceType: SPACE_TYPE_MAP.PRIVATE,
    spaceLevel: SPACE_LEVEL_MAP.COMMON,
  })
  if (data) {
    message.success('空间激活成功')
    await router.replace('/space/person')
  }
}

onMounted(() => {
  useLoginUserStore().checkLogin()
})
</script>

<style scoped></style>
