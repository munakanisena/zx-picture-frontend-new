import { useBreakpoints as useBreakpointsInner } from '@vueuse/core'
import type { UploadCustomRequestOptions } from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { saveAs } from 'file-saver'

const { message } = createDiscreteApi(['message'])
/**
 * 断点工具
 */
export const useBreakPoints = () =>
  useBreakpointsInner({
    mobile: 0,
    tablet: 540,
    desktop: 1200,
  })

/**
 * 获取选项
 * @param descriptionMap
 */
export const toOptions = (descriptionMap: Record<string | number, string>) => {
  return Object.entries(descriptionMap).map(([key, label]) => ({
    label: label,
    //这里根据类型判断 是否需要转换 因为不同枚举的key类型不同
    value: isNaN(Number(key)) ? key : Number(key),
  }))
}

/**
 * 将 CategoryVO 数组转换为选项列表
 * @param categories CategoryVO 数组
 */
export const categoryToOptions = (categories: CategoryVO[] = []) => {
  return categories.map((item) => ({
    label: item.name,
    value: item.id,
  }))
}

/**
 * 转16进制
 * @param input
 */
export function toHexColor(input: string) {
  // 去掉 0x 前缀
  const colorValue = input.startsWith('0x') ? input.slice(2) : input
  // 将剩余部分解析为十六进制数，再转成 6 位十六进制字符串
  const hexColor = parseInt(colorValue, 16).toString(16).padStart(6, '0')
  // 返回标准 #RRGGBB 格式
  return `#${hexColor}`
}

/**
 * 字节转MB，
 * @param bytes 字节数
 */
export function bytesToMB(bytes: number): number {
  if (bytes === 0) return 0
  return parseFloat((bytes / (1024 * 1024)).toFixed(2))
}

/**
 * 格式化文件大小
 * @param bytes
 */
export const formatSize = (bytes?: number) => {
  if (!bytes) return '未知'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * 上传图片前的校验
 * @param options
 */
export const checkUploadImage = (options: UploadCustomRequestOptions) => {
  if (options.file.file == null) {
    return
  }
  const file: File = options.file.file
  //判断图片类型
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg' ||
    file.type === 'image/webp'

  if (!isJpgOrPng) {
    message.error('图片类型错误 请上传jpeg/png/webp/jpg 格式的图片')
    return isJpgOrPng
  }
  const isLt5M = file.size / 1024 / 1024 < 50
  if (!isLt5M) {
    message.error('上传的图片大小不能超过50M')
    return isLt5M
  }
}

/**
 * 下载图片
 * @param url 图片下载地址
 * @param fileName 要保存为的文件名
 */
export async function downloadImage(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  try {
    const response = await fetch(url)
    if (!response.ok) {
      message.error('下载失败')
      return
    }
    //这里转换为异步 要等待
    saveAs(await response.blob(), fileName)
  } catch (e) {
    message.error('下载失败')
    console.log('下载失败', e)
  }
}
