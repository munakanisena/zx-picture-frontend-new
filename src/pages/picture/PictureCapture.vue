<template>
  <div style="height: 100%; background-color: #f5f5f5; padding: 20px">
    <n-flex justify="space-between" align="center">
      <n-h3>
        <n-icon-wrapper
          :size="24"
          :border-radius="5"
          style="vertical-align: middle; margin-right: 8px"
        >
          <n-icon :component="BugOutline" />
        </n-icon-wrapper>
        爬取图片
      </n-h3>
    </n-flex>

    <n-grid item-responsive responsive="screen" x-gap="12" y-gap="12" cols="1 l:24">
      <n-gi span="1 l:6">
        <n-card
          title="检索配置"
          bordered
          style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09); border-radius: 8px"
          :header-style="{ fontWeight: 500 }"
        >
          <n-form
            ref="formRef"
            label-placement="top"
            :model="captureFormParam"
            @submit.prevent="getCapturePictureListData"
            :rules="rules"
          >
            <n-form-item label="爬取来源" path="captureSource">
              <n-select
                v-model:value="captureFormParam.captureSource"
                placeholder="请选择爬取来源"
                :options="[{ label: '必应', value: 'BING' }]"
                clearable
                size="large"
              />
            </n-form-item>
            <n-form-item label="图片关键词" path="searchText">
              <n-input
                size="large"
                v-model:value="captureFormParam.searchText"
                placeholder="请输入图片关键词"
                clearable
              />
            </n-form-item>
            <n-form-item label="图片名称前缀 (可选)" path="namePrefix">
              <n-input
                size="large"
                v-model:value="captureFormParam.namePrefix"
                placeholder="请输入图片前缀"
                clearable
              />
            </n-form-item>
            <n-form-item label="随机种子(输入数字 1-100)" path="randomSeed">
              <n-input-number
                size="large"
                v-model:value="captureFormParam.randomSeed"
                placeholder="输入数字 0-100"
                :min="1"
                :max="100"
                clearable
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item label="抓取数量(默认10张,最多20张)" path="captureCount">
              <n-input-number
                size="large"
                v-model:value="captureFormParam.captureCount"
                placeholder="请输入抓取数量"
                :min="1"
                :max="30"
                clearable
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item>
              <n-button size="large" type="primary" attr-type="submit" block :loading="loading">
                开始爬取
              </n-button>
            </n-form-item>
          </n-form>
        </n-card>
      </n-gi>
      <n-gi span="1 l:18">
        <n-card
          v-if="!!capturePictureList"
          bordered
          style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09); border-radius: 8px; height: 100%"
        >
          <div style="height: calc(100vh - 300px); overflow-y: auto">
            <n-spin :show="spinning" style="width: 100%; height: 100%">
              <template #description> 请稍候...</template>
              <n-grid x-gap="16" y-gap="16" cols="1 s:2 m:2 l:3" responsive="screen">
                <n-gi v-for="(pictureResult, index) in capturePictureList" :key="index">
                  <n-card
                    :title="pictureResult.pictureName"
                    hoverable
                    embedded
                    style="text-align: center"
                    content-style=" padding:0 "
                  >
                    <template #cover>
                      <div style="height: 350px">
                        <n-image
                          style="width: 100%; height: 100%"
                          :src="pictureResult.handleCaptureUrl"
                          object-fit="contain"
                        >
                          <template #error>
                            <div
                              style="
                                height: 200px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background-color: #f0f0f0;
                              "
                            >
                              <n-icon size="48" color="#999">
                                <BugOutline />
                              </n-icon>
                              <n-text style="margin-left: 10px">图片加载失败或无法展示</n-text>
                            </div>
                          </template>
                        </n-image>
                      </div>
                    </template>
                    <template #action>
                      <n-flex justify="space-around">
                        <n-button
                          text
                          @click="uploadPicture(pictureResult)"
                          :style="{ display: 'flex', alignItems: 'center', gap: '8px' }"
                        >
                          <n-icon>
                            <CloudUploadOutline />
                          </n-icon>
                          上传到公共图库
                        </n-button>
                        <n-button
                          text
                          @click="openPicture(pictureResult)"
                          :style="{ display: 'flex', alignItems: 'center', gap: '8px' }"
                        >
                          <n-icon>
                            <ShareSocialOutline />
                          </n-icon>
                          图片来源
                        </n-button>
                      </n-flex>
                    </template>
                  </n-card>
                </n-gi>
              </n-grid>
              <n-empty
                :description="emptyDesc"
                :style="{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'calc(100vh - 300px)',
                }"
              >
                <template #icon>
                  <n-icon>
                    <BugOutline />
                  </n-icon>
                </template>
              </n-empty>
            </n-spin>
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { BugOutline, CloudUploadOutline, ShareSocialOutline } from '@vicons/ionicons5'
import {
  capturePictureUsingPost,
  uploadPictureByCaptureUsingPost,
} from '@/api/pictureController.ts'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'

const formRef = ref<FormInst | null>(null)
const captureFormParam = reactive<API.capturePictureRequest>({
  randomSeed: 1,
  captureCount: 10,
})

const emptyDesc = ref<string>()
const loading = ref(false)
const spinning = ref<boolean>(false)
const capturePictureList = ref<API.CapturePictureResult[]>([])
const message = useMessage()

const rules: FormRules = {
  captureSource: [
    {
      required: true,
      message: '选择爬取来源',
      trigger: 'blur',
      validator: (_rule: FormItemRule, value: string) => value?.length > 0,
    },
  ],
  searchText: [
    {
      required: true,
      message: '图片关键词不能为空',
      trigger: 'blur',
      validator: (_rule: FormItemRule, value: string) => value?.length > 0,
    },
  ],
}

/**
 * 获取爬取图片列表数据
 */
const getCapturePictureListData = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  loading.value = true
  spinning.value = true
  try {
    const { data } = await capturePictureUsingPost(captureFormParam)
    if (data) {
      capturePictureList.value = data
      if (data.length === 0) {
        emptyDesc.value = '无匹配的图像!'
      }
    }
  } finally {
    spinning.value = false
    loading.value = false
  }
}

/**
 *
 * @param picture
 */
const uploadPicture = async (picture: API.CapturePictureResult) => {
  spinning.value = true
  try {
    await uploadPictureByCaptureUsingPost({
      pictureUrl: picture.captureUrl,
      pictureName: picture.pictureName,
    })
    message.success('图片上传成功!')
  } finally {
    spinning.value = false
  }
}

/**
 * 打开图片(跳转到图片来源地址)
 * @param picture
 */
const openPicture = (picture: API.CapturePictureResult) => {
  const link = document.createElement('a')
  link.href = picture.captureUrl as string
  //新开页面
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
