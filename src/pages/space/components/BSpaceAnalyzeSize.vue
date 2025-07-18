<template>
  <div style="text-align: center">
    <h2>图片大小分布分析</h2>
    <n-card class="chart-item">
      <v-chart :option="sizeBarOption" autoresize class="chart"></v-chart>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { analyzeSpaceSizeUsingPost } from '@/api/spaceAnalyzeController.ts'

use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

const chartData = ref<API.SpaceSizeAnalyzeResponse[]>()
const loading = ref(false)
const fetchCharData = async () => {
  loading.value = true
  const { data } = await analyzeSpaceSizeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId as any,
  })
  chartData.value = data
  loading.value = false
}
watch(chartData, (newCharData) => {
  updateChartOptions(newCharData as API.SpaceSizeAnalyzeResponse[])
})

onMounted(() => {
  fetchCharData()
})

const sizeBarOption = ref({})

// 处理数据并更新图表配置的函数
const updateChartOptions = (sizeList: API.SpaceSizeAnalyzeResponse[]) => {
  if (!sizeList || sizeList.length === 0) return

  // 提取大小范围作为 X 轴数据
  const sizeRanges = sizeList.map((item) => item.sizeRange)
  // 提取图片数量作为 Y 轴数据
  const counts = sizeList.map((item) => item.count)

  sizeBarOption.value = {
    title: {
      text: '图片大小分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}: {c} 张',
    },
    xAxis: {
      type: 'category',
      //X轴显示大小范围
      data: sizeRanges,
      axisLabel: {
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '图片数量 (张)',
      axisLabel: {
        formatter: '{value} 张',
      },
      // 确保最小刻度间隔为1，避免出现小数
      minInterval: 1,
    },
    grid: {
      // 调整图表实际绘制区域，为X轴标签留空间
      left: '3%',
      right: '4%',
      top: '10%',
      // 留出更多底部空间给旋转的标签
      bottom: '15%',
      containLabel: true,
    },
    series: [
      {
        name: '图片数量',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: '#FAC858',
        },
        label: {
          // 柱子顶部显示数值
          show: true,
          position: 'top',
          formatter: '{c}',
        },
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
