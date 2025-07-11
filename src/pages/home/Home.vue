<template>
  <n-flex vertical justify="center" align="center">
    <BHomeSearch @search="handleSearch" />
    <BCategory @categoryChange="handleCategoryChange" />
  </n-flex>
  <div style="padding: 24px">
    <BWaterfall :pictureList="pictureList" />
  </div>
  <div v-if="!hasMoreData">
    <n-divider>没有更多了</n-divider>
  </div>
</template>
<script setup lang="ts">
import BHomeSearch from '@/pages/home/components/BHomeSearch.vue'
import BWaterfall from '@/pages/home/components/BWaterfall.vue'
import BCategory from '@/pages/home/components/BCategory.vue'
import { onMounted, ref } from 'vue'
import { pageHomePicturesUsingPost } from '@/api/homeController.ts'

const isLoading = ref(false)
const hasMoreData = ref(true)
const pictureList = ref<API.PictureHomeVO[]>([])
const loadingBar = useLoadingBar()

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
  // 如果正在加载，或者已经没有更多数据了，则直接返回，不再执行后续代码
  if (isLoading.value || !hasMoreData.value) {
    return
  }
  loadingBar.start()
  const { data } = await pageHomePicturesUsingPost({
    ...searchParma.value,
  })
  //如果没有数据，则表示没有更多数据了
  if (data && data.records && data.records.length > 0) {
    pictureList.value = [...pictureList.value, ...(data.records as API.PictureHomeVO[])]

    //这里判断是否还有新数据
    if ((data.records?.length as number) < (searchParma.value?.pageSize as number)) {
      hasMoreData.value = false
    }
  } else {
    hasMoreData.value = false
  }
  isLoading.value = false
  loadingBar.finish()
}

onMounted(() => {
  fetchHomePictureList()
})

// useInfiniteScroll(
//   window,
//   () => {
//     ;(searchParma.value.current as number)++
//     fetchHomePictureList()
//   },
//   { distance: 100, canLoadMore: () => hasMoreData.value && !isLoading.value },
// )
</script>

<style scoped></style>
