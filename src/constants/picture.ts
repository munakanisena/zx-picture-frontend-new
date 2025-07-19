/**
 * 交互类型枚举
 */
export const PIC_INTERACTION_TYPE_ENUM = {
  LIKE: 0,
  COLLECT: 1,
}

/**
 * 交互状态枚举
 */
export const PIC_INTERACTION_STATUS_ENUM = {
  NOT_INTERACTED: 0,
  INTERACTED: 1,
}

/**
 * 图片格式枚举
 */
export const PIC_FORMAT_OPTION = [
  { label: 'JPEG', value: 'JPEG' },
  { label: 'PNG', value: 'PNG' },
  { label: 'GIF', value: 'GIF' },
  { label: 'WEBP', value: 'WEBP' },
]

/**
 * 审核枚举
 */
export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

/**
 * 审核映射
 */
export const PIC_REVIEW_STATUS_MAP: Record<number, string> = {
  [PIC_REVIEW_STATUS_ENUM.REVIEWING]: '待审核',
  [PIC_REVIEW_STATUS_ENUM.PASS]: '通过',
  [PIC_REVIEW_STATUS_ENUM.REJECT]: '拒绝',
}

/**
 * 图片协同编辑 消息类型枚举
 */
export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  ENTER_EDIT: 'ENTER_EDIT',
  EXIT_EDIT: 'EXIT_EDIT',
  EDIT_ACTION: 'EDIT_ACTION',
}

/**
 * 图片协同编辑 消息类型映射
 */
export const PICTURE_EDIT_MESSAGE_TYPE_MAP: Record<string, string> = {
  INFO: '发送通知',
  ERROR: '发送错误',
  ENTER_EDIT: '进入编辑状态',
  EXIT_EDIT: '退出编辑状态',
  EDIT_ACTION: '执行编辑操作',
}

/**
 * 图片协同编辑 操作类型枚举
 */
export const PICTURE_EDIT_ACTION_ENUM = {
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  ROTATE_LEFT: 'ROTATE_LEFT',
  ROTATE_RIGHT: 'ROTATE_RIGHT',
}

/**
 * 图片协同编辑 操作类型映射
 */
export const PICTURE_EDIT_ACTION_MAP: Record<string, string> = {
  ZOOM_IN: '放大操作',
  ZOOM_OUT: '缩小操作',
  ROTATE_LEFT: '左旋操作',
  ROTATE_RIGHT: '右旋操作',
}
