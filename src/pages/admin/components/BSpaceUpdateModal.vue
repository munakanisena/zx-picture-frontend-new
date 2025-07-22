<template>
  <n-modal v-model:show="show" preset="dialog" title="编辑用户">
    <n-form :model="formValue">
      <n-form-item label="空间名称" prop="spaceName">
        <n-input v-model:value="formValue.spaceName" />
      </n-form-item>
      <n-form-item label="空间等级" prop="spaceLevel">
        <n-select v-model:value="formValue.spaceLevel" :options="toOptions(SPACE_LEVEL_MAP)" />
      </n-form-item>
      <n-form-item label="空间图片的最大总大小" prop="maxSize">
        <n-input v-model:value="formValue.maxSize" />
      </n-form-item>
      <n-form-item label="空间图片的最大数量" prop="maxCount">
        <n-input v-model:value="formValue.maxCount" />
      </n-form-item>
    </n-form>
    <n-space>
      <n-button @click="closeUpdateModal">取消</n-button>
      <n-button type="primary" @click="userUpdate" :loading="loading">保存</n-button>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { defineExpose, ref, watch } from 'vue'
import { toOptions } from '@/utils/util.ts'
import { SPACE_LEVEL_MAP } from '@/constants/space.ts'
import { updateSpaceUsingPost } from '@/api/spaceController.ts'

const message = useMessage()
const show = ref(false)
const loading = ref(false)

const props = defineProps<{
  currentSpace: API.SpaceVO
  refresh: () => void
}>()

// 表单数据
const formValue = ref<API.SpaceUpdateRequest>({})

const userUpdate = async () => {
  try {
    loading.value = true
    //todo 这里全传有问题
    await updateSpaceUsingPost({ ...formValue.value })
    message.success('空间信息更新成功')
    //刷新列表
    props.refresh()
    closeUpdateModal()
  } finally {
    loading.value = false
  }
}

watch(
  () => props.currentSpace,
  (newSpace) => {
    formValue.value = { ...newSpace }
  },
  { immediate: true },
)

const openUpdateModal = () => {
  show.value = true
}

const closeUpdateModal = () => {
  show.value = false
}

//可以将函数暴露给父组件
defineExpose({
  openUpdateModal,
})
</script>
