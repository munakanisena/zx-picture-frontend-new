<template>
  <div style="text-align: center; padding: 24px">
    <n-card title="用户上传数量趋势">
      <n-flex
        justify="space-between"
        style="padding-left: 10%; padding-right: 10%; margin-bottom: 12px"
      >
        <n-space align="center">
          <n-text>选择时间维度:</n-text>
          <n-select
            v-model:value="timeDimension"
            :options="timeDimensionOptions"
            style="width: 100px"
            @update:value="handleUpdateValue"
          />
        </n-space>
        <div>
          <n-input-group v-if="userInfo.role === USER_ROLE_ENUM.ADMIN">
            <n-input
              :style="{ width: '100%' }"
              v-model:value="userId"
              placeholder="请输入用户id(默认登录id)"
            />
            <n-button type="primary" @click="doSearch" ghost> 搜索</n-button>
          </n-input-group>
        </div>
      </n-flex>
      <div class="charts-wrapper">
        <div class="chart-item">
          {{ chartTitle }}
          <v-chart
            :option="uploadActionOption"
            :loading="loading"
            autoresize
            class="chart"
          ></v-chart>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed, onMounted, ref, watch } from 'vue'
import { timeDimensionOptions } from '@/constants/space.ts'
import { analyzeSpaceUserActionUsingPost } from '@/api/spaceAnalyzeController.ts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { NCard } from 'naive-ui'
import { USER_ROLE_ENUM } from '@/constants/user.ts'

use([TooltipComponent, GridComponent, LineChart, CanvasRenderer])
const timeDimension = ref<string>('day')
const chartData = ref<API.SpaceUserAnalyzeResponse[]>()
const loading = ref(false)
const userInfo = useLoginUserStore().userInfo
//默认是登录用户的id
const userId = ref(userInfo.id)

const doSearch = () => {
  fetchCharData()
}

//选中后触发事件
const handleUpdateValue = () => {
  fetchCharData()
}

const fetchCharData = async () => {
  loading.value = true
  const { data } = await analyzeSpaceUserActionUsingPost({
    timeDimension: timeDimension.value,
    userId: userId.value,
  })
  chartData.value = data
  loading.value = false
}

onMounted(() => {
  fetchCharData()
})

watch(chartData, (newCharData) => {
  updateChartOptions(newCharData as API.SpaceTagAnalyzeResponse[])
})

// 根据选择的时间维度动态生成图表标题
const chartTitle = computed(() => {
  switch (timeDimension.value) {
    case 'day':
      return '每日上传数量'
    case 'week':
      return '每周上传数量'
    case 'month':
      return '每月上传数量'
    default:
      return '上传数量趋势'
  }
})
//用户上传行为配置
const uploadActionOption = ref()
// 处理数据并更新图表配置的函数
const updateChartOptions = (uploadList: API.SpaceUserAnalyzeResponse[]) => {
  if (!uploadList || uploadList.length === 0) {
    // 数据为空时显示空状态或清空图表
    uploadActionOption.value = {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#999',
          fontSize: 20,
        },
      },
    }
    return
  }
  // 根据上传行为分类数据
  const periods = chartData.value?.map((item) => item.period)
  const counts = chartData.value?.map((item) => item.count)
  uploadActionOption.value = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: '时间区间' },
    yAxis: { type: 'value', name: '上传数量' },
    series: [
      {
        name: '上传数量',
        type: 'line',
        data: counts,
        // 平滑折线
        smooth: true,
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
}
</script>

<style scoped>
.charts-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-item {
  width: 80%;
  min-width: 600px;
  height: 500px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
