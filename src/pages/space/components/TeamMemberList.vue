<template>
  <div class="team-member-list">
    <NCard title="团队成员" :bordered="false" size="small">
      <NScrollbar style="max-height: 400px" @scroll="handleScroll">
        <NList hoverable clickable>
          <NListItem v-for="member in members" :key="member.id">
            <NThing>
              <template #avatar>
                <NAvatar :src="member.avatar" round />
              </template>
              <template #header>
                {{ member.name }}
              </template>
              <template #description>
                <NTag :type="member.role === 'admin' ? 'success' : 'info'" size="small">
                  {{ member.role }}
                </NTag>
              </template>
            </NThing>
          </NListItem>
          <NEmpty v-if="members.length === 0" description="暂无成员" />
        </NList>
      </NScrollbar>
    </NCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NCard, NScrollbar, NList, NListItem, NThing, NAvatar, NTag, NEmpty } from 'naive-ui';

// 模拟成员数据
const members = ref([
  { id: 1, name: '张三', role: 'admin', avatar: 'https://cdn.naiveui.com/assets/avatar1.jpg' },
  { id: 2, name: '李四', role: 'member', avatar: 'https://cdn.naiveui.com/assets/avatar2.jpg' },
  { id: 3, name: '王五', role: 'member', avatar: 'https://cdn.naiveui.com/assets/avatar3.jpg' },
  { id: 4, name: '赵六', role: 'member', avatar: 'https://cdn.naiveui.com/assets/avatar4.jpg' },
  { id: 5, name: '钱七', role: 'member', avatar: 'https://cdn.naiveui.com/assets/avatar5.jpg' },
  { id: 6, name: '孙八', role: 'member', avatar: 'https://cdn.naiveui.com/assets/avatar6.jpg' },
  { id: 7, name: '周九', role: 'member', avatar: 'https://cdn.naiveui.com/assets/avatar7.jpg' },
  { id: 8, name: '吴十', role: 'member', avatar: 'https://cdn.naiveui.com/assets/avatar8.jpg' },
]);

/**
 * 滚动事件处理函数。
 * 当 NScrollbar 滚动时触发。
 * @param {Event} e 滚动事件对象
 */
const handleScroll = (e) => {
  // 你可以在这里处理滚动事件，例如实现无限滚动或检测滚动位置
  console.log('滚动中...');
  console.log('滚动位置:', e.target.scrollTop);
};

onMounted(() => {
  console.log('TeamMemberList 组件已挂载');
});
</script>

<style scoped>
.team-member-list {
  /* 可以添加一些样式 */
}
</style>
