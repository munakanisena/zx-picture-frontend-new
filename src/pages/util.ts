import {
  useBreakpoints as useBreakpointsInner,
  useWindowSize,
} from '@vueuse/core';
import { format, isValid } from 'date-fns';
/**
 * 断点工具
 */
export const useBreakPoints=()=>
  useBreakpointsInner({
    mobile: 0,
    tablet: 540,
    desktop: 1200,
  })


// 格式化日期
export function safeFormatDate(dateString:any, formatPattern = 'yyyy-MM-dd') {
  if (!dateString) return '-';

  try {
    // 尝试解析日期
    const date = new Date(dateString);

    // 使用 date-fns 的 isValid 函数检查有效性
    if (!isValid(date)) {
      console.error('无效日期:', dateString);
      return '-';
    }

    // 使用 date-fns 的 format 函数
    return format(date, formatPattern);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '-';
  }
}
