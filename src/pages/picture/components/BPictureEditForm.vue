<template>
  <n-card title="修改图片信息">
    <n-form ref="formRef" :model="pictureEditForm" @submit="handlePictureEditSubmit">
      <n-form-item
        label="图片名称 (必填)"
        path="picName"
        :rules="[{ required: true, message: '请输入图片名称' }]"
      >
        <n-input
          v-model:value="pictureEditForm.picName"
          placeholder="请输入图片名称"
          clearable
          size="large"
        />
      </n-form-item>

      <n-form-item label="所属分类" path="categoryId">
        <n-select
          v-model:value="pictureEditForm.categoryId"
          :options="categoryToOptions(categoryList)"
          placeholder="请选择图片分类"
          clearable
          size="large"
          block
        />
      </n-form-item>

      <n-form-item label="标签（可以输入多个）" path="tags">
        <n-select
          v-model:value="pictureEditForm.tags"
          tag
          filterable
          multiple
          placeholder="请输入图片标签"
          size="large"
        />
      </n-form-item>

      <n-form-item label="图片介绍" path="picDesc">
        <n-input
          v-model:value="pictureEditForm.picDesc"
          type="textarea"
          placeholder="请输入图片介绍"
          :autosize="{ minRows: 2, maxRows: 5 }"
          clearable
        />
      </n-form-item>

      <n-form-item>
        <n-button
          type="primary"
          color="#ff69b4"
          size="large"
          block
          @click="formRef?.validate().then(() => handlePictureEditSubmit())"
        >
          修改
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import { listHomeCategoriesUsingGet } from '@/api/homeController.js'
import { categoryToOptions } from '@/utils/util.js'
import { editPictureUsingPost, updatePictureUsingPost } from '@/api/pictureController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { USER_ROLE_ENUM } from '@/constants/user.ts'

const props = defineProps<{
  pictureDetail?: API.PictureDetailVO
}>()
// 表单引用
const formRef = useTemplateRef('formRef')
const categoryList = ref<API.CategoryVO>()
const message = useMessage()
const loadingBar = useLoadingBar()

// 表单数据
const pictureEditForm = reactive<API.PictureEditRequest>({
  id: props.pictureDetail?.id,
  picName: props.pictureDetail?.picName,
  categoryId: props.pictureDetail?.categoryId,
  tags: props.pictureDetail?.tags,
  picDesc: props.pictureDetail?.picDesc,
  spaceId: props.pictureDetail?.spaceId,
})

// 表单提交处理
const handlePictureEditSubmit = async () => {
  loadingBar.start()
  try {
    if (useLoginUserStore().userInfo.role === USER_ROLE_ENUM.ADMIN) {
      await updatePictureUsingPost({ ...pictureEditForm })
    } else {
      await editPictureUsingPost({ ...pictureEditForm })
    }
    message.success('修改成功')
  } finally {
    loadingBar.finish()
  }
}

onMounted(async () => {
  const { data } = await listHomeCategoriesUsingGet()
  categoryList.value = data || []
})
</script>

<style scoped></style>
