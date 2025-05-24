<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="上传头像"
  >
    <!-- 添加 v-model:file-list 绑定 -->
    <n-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :max="1"
      :default-upload="false"
      :on-before-upload="beforeUpload"
    >
      <n-upload-dragger>
        <div style="padding: 20px">
          <n-icon size="48" depth="3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16h-2zm-5 4q-.825 0-1.413-.588T4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413T18 20H6z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
          <p>点击或拖动文件到此处上传</p>
        </div>
      </n-upload-dragger>
    </n-upload>
    <template #action>
      <n-space>
        <n-button @click="closeModal">取消</n-button>
        <n-button type="primary" :loading="uploading" @click="uploadAvatar">上传</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadInst,UploadCustomRequestOptions,UploadFileInfo } from 'naive-ui'
import { uploadAvatarUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'


const message = useMessage()
const uploadRef = ref<UploadInst | null>(null)
const show=ref(false)
const uploading = ref(false)
// 新增文件列表响应式变量
const fileList = ref<UploadFileInfo[]>([])

// 上传逻辑修改
const uploadAvatar = async () => {
  if (fileList.value.length === 0) {
    message.error('请先选择要上传的文件')
    return
  }
  const uploadFile = fileList.value[0]
  // 检查文件状态（新增）
  if (uploadFile.status !== 'pending') {
    message.error('文件状态异常，请重新选择')
    return
  }
  // 获取原生File对象（关键修改）
  const file= uploadFile.file
  if (!file) {
    message.error('获取文件失败')
    return
  }
    uploading.value = true
    // 调用上传接口（保持原样）
    const {data}= await uploadAvatarUsingPost({},file)
    message.success('头像上传成功')
    useLoginUserStore().userState.uerInfo.userAvatar=data as string
    // 关闭上传状态（新增）
    closeModal()
    // 清空文件列表（修改方式）
    fileList.value = []
    uploading.value = false
}



/**
 *上传前的校验
 * @param options
 */
const beforeUpload = (options:UploadCustomRequestOptions) => {
  if (options.file.file==null){
    return
  }
  //取 文件信息出来
  const  file : File  =options.file.file
  //判断图片类型
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type=== 'image/jpg'|| file.type === 'image/webp'

  if (!isJpgOrPng) {
    message.error('图片类型错误 请上传jpeg/png/webp/jpg 格式的图片');
    return isJpgOrPng
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('上传的头像大小不能超过2M');
    return isLt2M
  }
};


// 打开上传模态框
const openModal=()=>{
  show.value=true
}

//关闭模态框
const closeModal=()=>{
  show.value=false
}


//可以将函数暴露给父组件
defineExpose({
  openModal,
})

</script>


