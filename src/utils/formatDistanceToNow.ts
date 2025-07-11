import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

/**
 * 格式化距离现在的时间
 * @param pastTime
 */
export const formatDistanceToNow = (pastTime: number | Date | string) => {
  return dayjs(pastTime).locale('zh-cn').fromNow()
}
