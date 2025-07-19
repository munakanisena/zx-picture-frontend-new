<template>
  <n-modal
    v-model:show="isShow"
    title="裁剪图片"
    preset="card"
    transform-origin="center"
    class="modal"
  >
    <vue-cropper
      ref="cropperRef"
      :img="imageUrl"
      :original="true"
      :centerBox="true"
      :autoCrop="true"
      :info="true"
      :outputSize="0.8"
      outputType="webp"
      style="width: 100%; height: 80%"
    />
    <div style="height: 24px"></div>
    <n-flex v-if="isTeamSpace" style="margin-bottom: 8px" justify="center">
      <!-- 协同编辑操作 -->
      <n-button v-if="editingUser" disabled> {{ editingUser.name }}正在编辑</n-button>
      <n-button v-if="canEnterEdit" type="primary" ghost @click="enterEdit">进入编辑</n-button>
      <n-button v-if="canExitEdit" danger ghost @click="exitEdit">退出编辑</n-button>
    </n-flex>
    <!--裁剪编辑操作-->
    <n-flex justify="center">
      <n-button @click="changeScale(1)" :disabled="!canEdit">放大</n-button>
      <n-button @click="changeScale(-1)" :disabled="!canEdit">缩小</n-button>
      <n-button @click="rotateLeft" :disabled="!canEdit">向左旋转</n-button>
      <n-button @click="rotateRight" :disabled="!canEdit">向右旋转</n-button>
      <n-button @click="closeModal" :disabled="!canEdit">取消</n-button>
      <n-button type="primary" :loading="loading" @click="handleCrop" :disabled="!canEdit"
        >确定
      </n-button>
    </n-flex>
  </n-modal>
</template>
<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { computed, onUnmounted, ref, useTemplateRef, watchEffect } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import PictureEditWebSocket from '@/ws/pictureEditWebSocket.ts'
import { PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM } from '@/constants/picture.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'

const emit = defineEmits(['upload'])

const isShow = ref<boolean>(false)
const imageUrl = ref<string>()
const loading = ref<boolean>(false)
const cropperRef = useTemplateRef('cropperRef')
const message = useMessage()

const props = defineProps<{
  pictureId?: string
  spaceType?: number
}>()

// 是否为团队空间
const isTeamSpace = computed(() => {
  return Number(props.spaceType) === SPACE_TYPE_ENUM.TEAM
})

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

/**
 * 图片缩放
 * @param num
 */
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}

//处理裁剪图片
const handleCrop = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    loading.value = true
    const fileName = 'image.webp'
    const file = new File([blob], fileName, { type: blob.type })
    //由父组件决定如何上传
    emit('upload', file)
    loading.value = false
    closeModal()
  })
}

const closeModal = () => {
  isShow.value = false
  // 断开websocket连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
  //释放Url
  URL.revokeObjectURL(imageUrl.value as string)
}

/**
 * 打开裁剪模态框 并获得裁剪的图片
 * @param imageFileOrUrl 文件或者文件地址
 */
const openModalAndSendImage = (imageFileOrUrl: File | string) => {
  isShow.value = true
  if (imageFileOrUrl instanceof File) {
    imageUrl.value = URL.createObjectURL(imageFileOrUrl)
  } else {
    imageUrl.value = imageFileOrUrl
  }
}

defineExpose({
  openModalAndSendImage,
})

// --------- 实时编辑 ---------
const userInfo = useLoginUserStore().userInfo
// 正在编辑的用户
const editingUser = ref<API.UserDetailVO>()

// 没有用户正在编辑中，可进入编辑
const canEnterEdit = computed(() => {
  return !editingUser.value
})
// 正在编辑的用户是本人，可退出编辑
const canExitEdit = computed(() => {
  return editingUser.value?.id === userInfo.id
})

// 可以编辑
const canEdit = computed(() => {
  // 不是团队空间，则默认可编辑
  if (!isTeamSpace.value) {
    return true
  }
  console.log(editingUser.value?.id, userInfo.id)
  return editingUser.value?.id === userInfo.id
})

let websocket: PictureEditWebSocket | null

// 初始化 WebSocket 连接，绑定事件
const initWebsocket = () => {
  const pictureId = props.pictureId
  if (!pictureId || !isShow.value) {
    return
  }
  // 防止之前的连接未释放
  if (websocket) {
    websocket.disconnect()
  }
  // 创建 WebSocket 实例
  websocket = new PictureEditWebSocket(props.pictureId as any)
  // 建立 WebSocket 连接
  websocket.connect()

  // 监听通知消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    console.log('收到通知消息：', msg)
    message.info(msg.message)
  })

  // 监听错误消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    console.log('收到错误消息：', msg)
    message.error(msg.message)
  })

  // 监听进入编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    console.log('收到进入编辑状态消息：', msg)
    message.info(msg.message)
    //设置进入编辑状态的人
    editingUser.value = msg.userDetailVO
  })

  // 监听编辑操作消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    console.log('收到编辑操作消息：', msg)
    message.info(msg.message)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break
    }
  })

  // 监听退出编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    console.log('收到退出编辑状态消息：', msg)
    message.info(msg.message)
    //退出 设置为可以编辑
    editingUser.value = undefined
  })
}

// 进入编辑状态
const enterEdit = () => {
  if (websocket) {
    // 发送进入编辑状态的消息
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
    })
  }
  //设置自己为编辑者
  editingUser.value = userInfo
}

// 退出编辑状态
const exitEdit = () => {
  if (websocket) {
    // 发送退出编辑状态的消息
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
    })
  }
  //退出 设置为可以编辑
  editingUser.value = undefined
}

// 编辑图片操作
const editAction = (action: string) => {
  if (websocket) {
    // 发送编辑操作的请求
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action,
    })
  }
}

watchEffect(() => {
  // 团队空间才初始化
  if (isTeamSpace.value) {
    initWebsocket()
  }
})

onUnmounted(() => {
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})
</script>
<style>
.modal {
  height: 600px;
  width: 800px;
}

@media screen and (max-width: 768px) {
  .modal {
    height: 500px;
    width: 400px;
  }
}
</style>
