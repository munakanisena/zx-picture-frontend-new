<template>
  <n-flex vertical justify="center" align="center">
    <BHomeSearch @search="handleSearch" />
    <BCategory @categoryChange="handleCategoryChange" />
  </n-flex>
  <div style="padding: 24px">
    <BWaterfall :pictureList="pictureList" :scroll-container="scrollContainerRef" />
  </div>
  <n-back-top :bottom="64" :right="48" >
  </n-back-top>
  <n-divider v-if="!hasMoreData && pictureList.length > 0"> 没有更多内容了</n-divider>
</template>
<script setup lang="ts">
import BHomeSearch from '@/pages/home/components/BHomeSearch.vue'
import BWaterfall from '@/pages/home/components/BWaterfall.vue'
import BCategory from '@/pages/home/components/BCategory.vue'
import { onMounted, ref } from 'vue'
import { pageHomePicturesUsingPost } from '@/api/homeController.ts'
import { useInfiniteScroll } from '@vueuse/core'

//用于实现加载锁。也就等待前一个请求发送完毕再发送
const isLoading = ref(false)
//用于停止无限滚动
const hasMoreData = ref(true)
const pictureList = ref<API.PictureHomeVO[]>([])
const scrollContainerRef = ref<HTMLElement | null>(null)

const searchParma = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 20,
  searchText: undefined,
  categoryId: undefined,
})

// 处理搜索事件
const handleSearch = (searchText: string) => {
  searchParma.value.searchText = searchText
  searchParma.value.current = 1
  hasMoreData.value = true
  pictureList.value = []
  fetchHomePictureList()
}

// 处理分类切换事件
const handleCategoryChange = (categoryId: number) => {
  searchParma.value.categoryId = categoryId
  searchParma.value.current = 1
  hasMoreData.value = true
  pictureList.value = []
  fetchHomePictureList()
}

// 统一请求图片数据
const fetchHomePictureList = async () => {
  //此时正在加载中。取消本次请求
  if (isLoading.value || !hasMoreData.value) {
    return
  }
  // 上锁
  isLoading.value = true

  try {
    const { data } = await pageHomePicturesUsingPost({
      ...searchParma.value,
    })

    if (data && data.records && data.records.length > 0) {
      pictureList.value = [...pictureList.value, ...data.records]

      if (data.total <= pictureList.value.length) {
        hasMoreData.value = false
      } else {
        searchParma.value.current++
      }
    } else {
      hasMoreData.value = false
    }
  } catch (error) {
    console.error('加载图片失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchHomePictureList()
  // 监听滚动事件 这里因为用了组件布局 实际页面滚动条不是window
  scrollContainerRef.value = document.querySelector('.n-layout-content .n-layout-scroll-container')
})

/**
 * 监听滚动事件，实现无限滚动
 */
useInfiniteScroll(scrollContainerRef, fetchHomePictureList, {
  distance: 200,
  canLoadMore: () => !isLoading.value && hasMoreData.value,
})
</script>

<style scoped></style>
