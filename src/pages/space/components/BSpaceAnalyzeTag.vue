<template>
  <div style="text-align: center;">
    <h2>图片标签分析</h2>
    <n-card class="chart-item">
      <v-chart :option="tagWordCloudOption" :loading="loading" autoresize class="chart"></v-chart>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { analyzeSpaceTagsUsingPost } from '@/api/spaceAnalyzeController.ts'
import 'echarts-wordcloud'

use([TitleComponent, TooltipComponent, CanvasRenderer])

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

const chartData = ref<API.SpaceTagAnalyzeResponse[]>()
const loading = ref(false)
const fetchCharData = async () => {
  loading.value = true
  const { data } = await analyzeSpaceTagsUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId as any,
  })
  chartData.value = data
  loading.value = false
}
watch(chartData, (newCharData) => {
  updateChartOptions(newCharData as API.SpaceTagAnalyzeResponse[])
})

onMounted(() => {
  fetchCharData()
})

//词云配置
const tagWordCloudOption = ref({})

const updateChartOptions = (tagList: API.SpaceTagAnalyzeResponse[]) => {
  if (!tagList || tagList.length === 0) return

  const tagData = tagList.map((item) => ({
    name: item.tagName,
    value: item.count,
  }))

  tagWordCloudOption.value = {
    title: {
      text: '标签统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value} 次`,
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 10,
        // 字体大小范围
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
        },
        data: tagData,
      },
    ],
  }
}
</script>

<style scoped>
.chart-item {
  width: 600px;
  height: 400px;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart {
  height: 100%;
  width: 100%;
}
</style>
