/**
 * 空间类型枚举
 */
export const SPACE_TYPE_ENUM = {
  PUBLIC: 0,
  PRIVATE: 1,
  TEAM: 2,
}

/**
 * 空间类型映射
 */
export const SPACE_TYPE_MAP: Record<number, string> = {
  0: '公共空间',
  1: '私有空间',
  2: '团队团队',
}

/**
 * 空间等级枚举
 */
export const SPACE_LEVEL_ENUM = {
  COMMON: 0,
  PROFESSIONAL: 1,
  FLAGSHIP: 2,
}

// 空间级别数据
export const SPACE_LEVEL_LIST = [
  { text: '普通版', maxSize: 100 * 1024 * 1024, maxCount: 100 },
  { text: '专业版', maxSize: 1000 * 1024 * 1024, maxCount: 1000 },
  { text: '旗舰版', maxSize: 10000 * 1024 * 1024, maxCount: 10000 },
]

/**
 * 空间等级映射
 */
export const SPACE_LEVEL_MAP: Record<number, string> = {
  0: '普通空间',
  1: '专业空间',
  2: '旗舰空间',
}

/**
 * 商户上传行为维度常量
 */
export const timeDimensionOptions = [
  {
    label: '日',
    value: 'day',
  },
  {
    label: '周',
    value: 'week',
  },
  {
    label: '月',
    value: 'month',
  },
]

/**
 * 空间角色枚举
 */
export const SPACE_ROLE_ENUM = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
}

/**
 * 空间角色映射
 */
export const SPACE_ROLE_MAP: Record<string, string> = {
  viewer: '浏览者',
  editor: '编辑者',
  admin: '管理员',
}

/**
 * 空间权限常量
 */
export const SPACE_PERMISSION_ENUM = {
  SPACE_USER_MANAGE: 'spaceUser:manage',
  PICTURE_VIEW: 'picture:view',
  PICTURE_UPLOAD: 'picture:upload',
  PICTURE_EDIT: 'picture:edit',
  PICTURE_DELETE: 'picture:delete',
} as const
