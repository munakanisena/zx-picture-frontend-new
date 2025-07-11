import { useBreakpoints as useBreakpointsInner } from '@vueuse/core'
import { format, isValid } from 'date-fns'
import { type Component, h } from 'vue'
import { NIcon } from 'naive-ui'

/**
 * 断点工具
 */
export const useBreakPoints = () =>
  useBreakpointsInner({
    mobile: 0,
    tablet: 540,
    desktop: 1200,
  })

// 格式化日期
export const safeFormatDate = (dateString: any, formatPattern = 'yyyy-MM-dd') => {
  if (!dateString) return '-'

  try {
    // 尝试解析日期
    const date = new Date(dateString)

    // 使用 date-fns 的 isValid 函数检查有效性
    if (!isValid(date)) {
      console.error('无效日期:', dateString)
      return '-'
    }

    // 使用 date-fns 的 format 函数
    return format(date, formatPattern)
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '-'
  }
}

/**
 * 获取选项
 * @param descriptionMap
 */
export const toOptions = (descriptionMap: Record<string | number, string>) => {
  return Object.entries(descriptionMap).map(([key, value]) => ({
    label: value,
    value: key,
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
 * 渲染图标
 * @param icon
 */
const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })

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
 * 字节转MB，固定返回MB单位
 * @param bytes 字节数
 */
export function bytesToMB(bytes: number): number {
  if (bytes === 0) return 0
  return parseFloat((bytes / (1024 * 1024)).toFixed(2))
}

/**
 * 计算原始百分比
 * @param used 已使用值
 * @param total 总值
 */
export function calculatePercentage(
  used: number | null | undefined,
  total: number | null | undefined,
): number {
  if (used == null || total == null || total <= 0) {
    return 0
  }
  return (used / total) * 100
}
