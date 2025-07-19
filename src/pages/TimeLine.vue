<template>
  <!--开发时间线-->
  <div style="max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem">
    <div style="text-align: center; margin-bottom: 2rem; margin-top: 2px">
      <n-h1 style="font-size: 2.5em">项目开发时间线</n-h1>
      <n-p style="font-size: 1.5em">记录项目开发的过程</n-p>
    </div>
    <n-timeline size="large">
      <n-timeline-item
        v-for="(item, index) in timeLineItemList"
        :key="index"
        :type="getStateColor(item.state)"
      >
        <n-card embedded style="border-radius: 8px; max-width: 800px" :title="item.date" hoverable>
          <template #header-extra>
            <n-tag round :type="getStateColor(item.state)">{{ item.state }}</n-tag>
          </template>
          <div style="margin-left: 15px; font-size: 1.8em">
            {{ item.title }}
          </div>
          <n-ul v-for="(content, index) in item.content" :key="index">
            <n-li style="font-size: 1.25em">
              {{ content }}
            </n-li>
          </n-ul>
        </n-card>
      </n-timeline-item>
    </n-timeline>
  </div>
</template>

<script setup lang="ts">
interface timeLineItem {
  date: string
  title: string
  content?: string[]
  link?: { text: string; href: string }[]
  state: string
}

// state  已完成 进行中 规划中 重构中
const timeLineItemList: timeLineItem[] = [
  {
    date: '2025-07-19',
    title: '优化项目',
    content: ['协作编辑', '爬取图片'],
    state: '进行中',
  },
  {
    date: '2025-07-18',
    title: '团队空间',
    content: ['团队空间', '协作编辑'],
    state: '已完成',
  },
  {
    date: '2025-07-14',
    title: '空间模块',
    content: ['激活空间', '空间详情', '空间分析', '空间管理'],
    state: '已完成',
  },
  {
    date: '2025-07-13',
    title: '主页模块',
    content: ['主页展示', '主页搜索', '瀑布流'],
    state: '已完成',
  },
  {
    date: '2025-07-10',
    title: '图片模块',
    content: ['图片展示', '图片上传', '图片详情', '图片管理'],
    state: '已完成',
  },
  {
    date: '2025-05-19',
    title: '用户模块',
    content: ['用户注册', '用户资料', '用户设置', '用户管理'],
    state: '已完成',
  },
  {
    date: '2025-05-11',
    title: '项目初始化',
    state: '已完成',
  },
]

const getStateColor = (state: string) => {
  const color: Record<string, string> = {
    已完成: 'success',
    进行中: 'info',
    规划中: 'warning',
    重构中: 'error',
  }
  return color[state] || ''
}
</script>
