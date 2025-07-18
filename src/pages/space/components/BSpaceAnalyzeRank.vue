<template>
  <div style="text-align: center; padding: 24px">
    <n-card title="空间使用量 Top 10 排名">
      <n-tabs type="line" animated>
        <n-tab-pane name="chart" tab="图表展示">
          <v-chart class="chart" :option="chartOption" autoresize />
        </n-tab-pane>
        <n-tab-pane name="table" tab="详细排名">
          <n-data-table
            :columns="tableColumns"
            :data="tableData"
            :pagination="false"
            :bordered="false"
          />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { type DataTableColumns, NCard, NDataTable, NTabPane, NTabs, NTag } from 'naive-ui'
import { analyzeSpaceRankUsingGet } from '@/api/spaceAnalyzeController.ts'
import { bytesToMB, formatSize } from '@/utils/util.ts'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const chartData = ref<API.SpaceVO[]>()
const loading = ref(false)
const fetchCharData = async () => {
  loading.value = true
  const { data } = await analyzeSpaceRankUsingGet()
  chartData.value = data
  loading.value = false
}

onMounted(() => {
  fetchCharData()
})

watch(chartData, (newCharData) => {
  updateChartOptions(newCharData as API.SpaceVO[])
})

const chartOption = ref()

const updateChartOptions = (charData: API.SpaceVO[]) => {
  if (!charData || charData.length === 0) return
  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params: any) {
        return `${params[0].marker}${params[0].name}: ${formatSize(params[0].value)}`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      name: '使用量 (MB)',
    },
    yAxis: {
      type: 'category',
      data: charData.map((item) => item.spaceName).reverse(),
    },
    series: [
      {
        name: '空间使用量',
        type: 'bar',
        data: charData.map((item) => bytesToMB(item.usedSize as number)).reverse(),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}MB',
        },
        itemStyle: {
          color: '#5470c6',
        },
      },
    ],
  }
}

const tableColumns: DataTableColumns = [
  {
    title: '排名',
    key: 'rank',
    width: 80,
    align: 'center',
    render: (row: any, index: any) => {
      let type = 'default'
      if (index === 0) type = 'error'
      if (index === 1) type = 'warning'
      if (index === 2) type = 'info'
      return h(NTag, { type: type, round: true }, { default: () => row.rank })
    },
  },
  {
    title: '空间名称',
    key: 'spaceName',
  },
  {
    title: '使用量 (MB)',
    key: 'usage',
    align: 'right',
    render: (row: any) => {
      return formatSize(row.usedSize)
    },
  },
]

//构造表单数据
const tableData = computed(() =>
  chartData.value?.map((item, index) => ({
    ...item,
    key: index,
    rank: index + 1,
  })),
)
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
