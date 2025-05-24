<template>
  <div style="max-width: 80%; margin: 0 auto; padding: 10px">
    <n-card title="用户资料" size="large">
      <n-row :gutter="[16, 24]">
        <!-- 头像部分在手机端占满宽度，在平板及以上左侧占1/4 -->
        <n-col :span="24" :md="6">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px">
            <n-avatar
              style="
                border: 3px solid #fff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s;
                &:hover {
                  transform: scale(1.05);
                }
              "
              round
              :size="120"
              :src="userInfo.userAvatar"
            />
            <n-button
              style="width: 100%; max-width: 200px"
              @click="openAvatarModal"
              size="small"
              type="primary"
              ghost
            >
              更换头像
            </n-button>
          </div>
        </n-col>
        <!-- 详细信息部分在手机端占满宽度，在平板及以上右侧占3/4 -->
        <n-col :span="24" :md="18">
          <n-descriptions bordered size="large" :column="descriptionColumns">
            <n-descriptions-item label="用户名">
              {{ userInfo?.username || '-' }}
            </n-descriptions-item>
            <n-descriptions-item label="用户角色">
              <n-tag :type="userInfo?.userRole ? 'success' : 'default'">
                {{ userInfo?.userRole === 'admin' ? '管理员' : '普通用户' }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="会员状态">
              <n-tag :type="userInfo?.isVip ? 'success' : 'default'">
                {{ userInfo?.isVip === 1 ? '会员' : '非会员' }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="邮箱">
              {{ userInfo?.userEmail || '-' }}
            </n-descriptions-item>
            <n-descriptions-item label="手机号码">
              {{ userInfo?.userPhone || '-' }}
            </n-descriptions-item>
            <n-descriptions-item label="性别">
              {{ userSexText }}
            </n-descriptions-item>
            <n-descriptions-item label="个人简介">
              {{ userInfo?.userProfile || '-' }}
            </n-descriptions-item>
            <n-descriptions-item label="生日">
              {{
                userInfo?.birthday ? safeFormatDate(new Date(userInfo.birthday), 'yyyy-MM-dd') : '-'
              }}
            </n-descriptions-item>
            <n-descriptions-item label="注册时间">
              {{
                userInfo?.createTime
                  ? safeFormatDate(new Date(userInfo.createTime), 'yyyy-MM-dd')
                  : '-'
              }}
            </n-descriptions-item>
          </n-descriptions>

          <div style="margin-top: 20px; display: flex; justify-content: flex-end">
            <n-button type="primary" @click="openEditModal" style="margin-top: 16px">
              编辑资料
            </n-button>
          </div>
        </n-col>
      </n-row>
    </n-card>

    <!-- 用编辑户弹窗 -->
    <user-edit-modal ref="editModalRef" :user-data="userInfo"></user-edit-modal>

    <!-- 使用单独的上传头像弹窗组件 -->
    <upload-avatar-modal ref="avatarModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { safeFormatDate } from '@/pages/util.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import UploadAvatarModal from '@/pages/user/components/UploadAvatarModal.vue'
import UserEditModal from '@/pages/user/components/UserEditModal.vue'

const userInfo = computed(() => useLoginUserStore().userState.uerInfo as API.LoginUserDetailVO)

// 响应式设计相关
const isMobile = ref(false)
const descriptionColumns = computed(() => (isMobile.value ? 1 : 3))

// 检测屏幕宽度并设置响应式变量
const checkScreenWidth = () => {
  isMobile.value = window.innerWidth < 768
}

// 初始化和监听屏幕尺寸变化
onMounted(() => {
  checkScreenWidth()
  window.addEventListener('resize', checkScreenWidth)
})

//上传头像弹窗 组件实例
const avatarModalRef = ref()
// 打开头像弹窗
const openAvatarModal = () => {
  if (avatarModalRef.value) {
    avatarModalRef.value.openModal()
  }
}
//编辑用户 弹窗 组件实例
const editModalRef = ref()
const openEditModal = () => {
  if (editModalRef.value) {
    editModalRef.value.openModal()
  }
}

// 性别显示处理
const userSexText = computed(() => {
  if (!userInfo) return '-'
  const sexMap = ['男', '女', '保密']
  return sexMap[userInfo.value.userSex as number]
})
</script>
