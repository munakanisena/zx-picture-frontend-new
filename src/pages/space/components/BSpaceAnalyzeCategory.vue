<template>
  <div style="text-align: center">
    <h2>图片分类分析</h2>
    <n-flex justify="center" size="large">
      <n-card class="chart-item">
        <v-chart :option="countBarOption" autoresize class="chart"></v-chart>
      </n-card>
      <n-card class="chart-item">
        <v-chart :option="sizePieOption" autoresize class="chart"></v-chart>
      </n-card>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { analyzeSpaceCategoryUsingPost } from '@/api/spaceAnalyzeController.ts'

// 注册 ECharts 组件
use([
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
])

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})
const chartData = ref<API.SpaceCategoryAnalyzeResponse[]>()
const loading = ref(false)
const fetchCharData = async () => {
  loading.value = true
  const { data } = await analyzeSpaceCategoryUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId as any,
  })
  chartData.value = data
  loading.value = false
}

watch(chartData, (newCharData) => {
  updateChartOptions(newCharData as API.SpaceCategoryAnalyzeResponse[])
})

onMounted(() => {
  fetchCharData()
})

// 图片数量柱状图配置
const countBarOption = ref({})
// 空间占用饼图配置
const sizePieOption = ref({})

// 辅助函数：格式化字节大小
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 处理数据并更新图表配置的函数
const updateChartOptions = (categoryList: API.SpaceCategoryAnalyzeResponse[]) => {
  if (!categoryList || categoryList.length === 0) return

  // 提取分类名称作为 x 轴数据和饼图的名称
  const categoryNames = categoryList.map((item) => item.categoryName)
  // 提取图片数量作为柱状图数据
  const counts = categoryList.map((item) => item.count)
  // 提取总大小作为饼图数据 (需要转换为 { value, name } 格式)
  const totalSizesForPie = categoryList.map((item) => ({
    value: item.totalSize,
    name: item.categoryName,
  }))

  // 1. 各分类图片数量柱状图配置
  countBarOption.value = {
    title: {
      text: '各分类图片数量',
      left: 'center',
    },
    //提示工具
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      // 提示内容 {b} 是分类名称，{c} 是数量
      formatter: '{b}: {c} 张',
    },
    //x轴配置
    xAxis: {
      type: 'category',
      // X轴显示分类名称
      data: categoryNames,
      axisLabel: {
        // 标签旋转，防止过长重叠
        rotate: 45,
        // 显示所有标签
        interval: 0,
      },
    },
    //y轴配置
    yAxis: {
      type: 'value',
      name: '图片数量 (张)',
      axisLabel: {
        formatter: '{value} 张',
      },
    },
    // 图表绘图区域的布局配置
    grid: {
      // 调整图表实际绘制区域，为X轴标签留空间
      left: '3%',
      right: '4%',
      // 留出更多底部空间给旋转的标签
      bottom: '15%',
      // grid 区域是否包含坐标轴的刻度标签。设置为 true 可以防止标签溢出
      containLabel: true,
    },
    // 系列列表，定义了图表的类型和数据
    series: [
      {
        name: '图片数量',
        type: 'bar',
        // Y轴显示数量
        data: counts,
        itemStyle: {
          // 柱子颜色
          color: '#f39575',
        },
        // 柱子上的文本标签
        label: {
          // 柱子顶部显示数值
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
    ],
  }

  // 2. 各分类空间占用饼图配置
  sizePieOption.value = {
    title: {
      text: '各分类空间占用',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params:any) {
        let name = params.name
        let value = params.value
        // 饼图/漏斗图的百分比
        let percent = params.percent
        return `${name}: ${formatBytes(value)} (${percent}%)`
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      // 图例显示分类名称
      data: categoryNames,
    },
    series: [
      {
        name: '空间占用',
        type: 'pie',
        // 饼图半径
        radius: '60%',
        // 饼图中心位置，避免与标题和图例重叠
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          // 显示分类名称和百分比
          formatter: '{b}\n{d}%',
          fontSize: 12,
        },
        emphasis: {
          // 鼠标悬停时高亮
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: true,
        },
        // 饼图数据
        data: totalSizesForPie,
      },
    ],
  }
}
</script>

<style scoped>
.chart-item {
  min-width: 400px;
  max-width: 600px;
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
