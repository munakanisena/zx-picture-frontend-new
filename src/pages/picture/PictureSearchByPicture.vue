<template>
  <div style="height: 100%; background-color: #f5f5f5; padding: 20px">
    <n-flex justify="space-between" align="center">
      <n-h3>
        <n-icon-wrapper
          :size="24"
          :border-radius="5"
          style="vertical-align: middle; margin-right: 8px"
        >
          <n-icon>
            <SearchOutline />
          </n-icon>
        </n-icon-wrapper>
        以图搜图
      </n-h3>
    </n-flex>

    <n-grid item-responsive responsive="screen" x-gap="12" y-gap="12" cols="1 l:24">
      <n-gi span="1 l:6">
        <!--以图搜图原图片展示区-->
        <n-flex vertical>
          <n-card
            style="height: 250px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09); border-radius: 8px"
          >
            <template #cover>
              <n-image :src="pictureUrl" object-fit="contain"></n-image>
            </template>
          </n-card>
          <!--检索配置栏-->
          <n-card
            title="检索配置(默认为百度)"
            bordered
            style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09); border-radius: 8px"
            :header-style="{ fontWeight: 500 }"
          >
            <n-form
              ref="formRef"
              label-placement="top"
              :model="searchFormParam"
              @submit.prevent="searchPictureListData"
              :rules="rules"
            >
              <!--            <n-form-item label="搜索源(当前默认百度)">-->
              <!--                            <n-select-->
              <!--                              v-model:value="captureFormParam.captureSource"-->
              <!--                              placeholder="请选择爬取来源"-->
              <!--                              :options="[{ label: '百度', value: 'BAIDU' }]"-->
              <!--                              clearable-->
              <!--                              size="large"-->
              <!--                            />-->
              <!--            </n-form-item>-->
              <n-form-item label="随机种子(输入数字 1-100)" path="randomSeed">
                <n-input-number
                  size="large"
                  v-model:value="searchFormParam.randomSeed"
                  placeholder="输入数字 0-100"
                  :min="1"
                  :max="100"
                  clearable
                  style="width: 100%"
                />
              </n-form-item>
              <n-form-item label="抓取数量(默认10张,最多20张)" path="searchCount">
                <n-input-number
                  size="large"
                  v-model:value="searchFormParam.searchCount"
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
        </n-flex>
      </n-gi>
      <!--图片展示区-->
      <n-gi span="1 l:18">
        <n-card
          v-if="!!searchPictureList"
          bordered
          style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09); border-radius: 8px; height: 100%"
        >
          <div style="height: calc(100vh - 300px); overflow-y: auto">
            <n-spin :show="spinning" style="width: 100%; height: 100%">
              <template #description> 请稍候...</template>
              <n-grid x-gap="16" y-gap="16" cols="1 l:3" responsive="screen">
                <n-gi v-for="(pictureResult, index) in searchPictureList" :key="index">
                  <n-card
                    hoverable
                    embedded
                    style="width: 100%; height: 300px; text-align: center"
                    content-style=" padding:0 "
                  >
                    <template #cover>
                      <n-image :src="pictureResult.thumbUrl" object-fit="contain">
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
                    </template>
                    <template #action>
                      <n-flex justify="space-around">
                        <n-button
                          text
                          @click="downloadPicture(pictureResult)"
                          :style="{ display: 'flex', alignItems: 'center', gap: '8px' }"
                        >
                          <n-icon>
                            <CloudDownloadOutline />
                          </n-icon>
                          下载当前图片
                        </n-button>
                        <n-button
                          text
                          @click="openPicture(pictureResult)"
                          :style="{ display: 'flex', alignItems: 'center', gap: '8px' }"
                        >
                          <n-icon>
                            <ShareSocialOutline />
                          </n-icon>
                          当前图片来源
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
                    <SearchOutline />
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
import {
  BugOutline,
  CloudDownloadOutline,
  SearchOutline,
  ShareSocialOutline,
} from '@vicons/ionicons5'
import { searchPictureByPictureUsingPost } from '@/api/pictureController.ts'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { useRoute } from 'vue-router'

const route = useRoute()
const formRef = ref<FormInst | null>(null)
const searchFormParam = reactive<API.SearchPictureByPictureRequest>({
  pictureId: route.query.id,
  randomSeed: 1,
  searchCount: 10,
})

const emptyDesc = ref<string>()
const loading = ref(false)
const spinning = ref<boolean>(false)
const searchPictureList = ref<API.SearchPictureResult[]>([])
const message = useMessage()
const pictureUrl = ref<string>(route.query.url as string)

const rules: FormRules = {
  captureSource: [
    {
      required: true,
      message: '选择爬取来源',
      trigger: 'blur',
      validator: (_rule: FormItemRule, value: string) => value?.length > 0,
    },
  ],
}

/**
 * 获取爬取图片列表数据
 */
const searchPictureListData = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  message.loading('正在搜索中...')
  loading.value = true
  spinning.value = true
  try {
    const { data } = await searchPictureByPictureUsingPost(searchFormParam)
    if (data) {
      searchPictureList.value = data
      if (data.length === 0) {
        emptyDesc.value = '无匹配的图像!'
      }
    }
  } catch {
    message.error('搜索失败')
  } finally {
    spinning.value = false
    loading.value = false
  }
}

const downloadPicture = (picture: API.SearchPictureResult) => {}

/**
 * 打开图片(跳转到图片来源地址)
 * @param picture
 */
const openPicture = (picture: API.SearchPictureResult) => {
  const link = document.createElement('a')
  link.href = picture.fromUrl as string
  link.target = '_blank'
  link.download = `download_${Date.now()}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
