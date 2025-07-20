<template>
  <n-flex style="width: 90%; margin: 0 auto; padding: 24px" align="center" vertical>
    <h1>图片AI扩展</h1>
    <n-spin :show="show">
      <n-card embedded>
        <template #cover>
          <n-image
            style="max-height: 700px; min-height: 400px; min-width: 380px; max-width: 700px"
            object-fit="contain"
            :src="expandPicUrl"
          ></n-image>
        </template>
      </n-card>
      <div style="margin-top: 16px"></div>
      <n-button style="width: 100%; margin: 0 auto" type="info" block @click="clickDownload"
        >下载
      </n-button>
      <template #description> 扩图任务执行中，请耐心等待不要刷新页面...</template>
    </n-spin>
  </n-flex>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  createPictureExtendTaskUsingPost,
  queryPictureExtendTaskUsingGet,
} from '@/api/pictureController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const show = ref<boolean>(false)
const { pictureId } = defineProps<{ pictureId: string }>()
const message = useMessage()
// 扩图结果
const expandPicUrl = ref<string>('')
const taskId = ref<string>('')

// 轮询定时器
let pollingTimer: NodeJS.Timeout | null = null

// 清除轮询定时器
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

// 执行扩图
const doExpandPicture = async () => {
  try {
    show.value = true
    const { data } = await createPictureExtendTaskUsingPost({
      pictureId: pictureId as any,
      parameters: {
        xScale: 2,
        yScale: 2,
      },
    })
    taskId.value = data?.output?.taskId as string
    message.success('扩图任务已提交，请等待处理...')
    // 开始轮询
    startPolling()
  } catch {
    show.value = false
  }
}

// 开始轮询获取扩图结果
const startPolling = () => {
  if (!taskId.value) {
    message.warning('当前任务已失效')
    return
  }
  // 先立即查询一次
  checkExpandResult()
  // 然后设置定时器
  pollingTimer = setInterval(checkExpandResult, 5000)
}

// 检查扩图结果
const checkExpandResult = async () => {
  if (!taskId.value) return
  const { data } = await queryPictureExtendTaskUsingGet({
    taskId: taskId.value,
  })
  const taskResult = data.output
  if (taskResult.taskStatus === 'SUCCEEDED') {
    message.success('扩图成功')
    expandPicUrl.value = taskResult.outputImageUrl as string
    show.value = false
    //成功清除定时器
    clearPolling()
  } else if (taskResult.taskStatus === 'FAILED') {
    message.error('扩图任务执行失败')
  }
}

//下载图片
const clickDownload = async () => {
  useLoginUserStore().checkLogin()
  if (!expandPicUrl.value) {
    message.warning('请先完成扩图任务')
    return
  }
  const link = document.createElement('a')
  link.href = expandPicUrl.value
  link.download = 'download.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

//马上开始扩图
onMounted(() => {
  doExpandPicture()
})

// 组件卸载 清理定时器
onUnmounted(() => {
  clearPolling()
})
</script>
<style scoped></style>
