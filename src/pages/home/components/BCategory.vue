<template>
  <n-tabs
    v-model:value="selectedCategoryId"
    default-value=""
    justify-content="space-evenly"
    type="line"
    @update:value="doHomeSearch"
    size="large"
  >
    <n-tab name="" tab="全部图片" />
    <n-tab v-for="category in categoryList" :name="category.id" :tab="category.name" />
  </n-tabs>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listHomeCategoriesUsingGet } from '@/api/homeController.ts'

const emit = defineEmits(['categoryChange'])

const selectedCategoryId = ref<number>()

const categoryList = ref<API.CategoryVO[]>()
const doHomeSearch = (key: string | number) => {
  emit('categoryChange', key as number)
}

onMounted(async () => {
  const { data } = await listHomeCategoriesUsingGet()
  categoryList.value = data
})
</script>

<style scoped></style>
