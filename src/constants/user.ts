export const USER_ROLE_ENUM = {
  USER: 'user',
  ADMIN: 'admin',
}

export const USER_ROLE_MAP: Record<string, string> = {
  user: '普通用户',
  admin: '管理员',
}

export const USER_STATE_MAP: Record<number, string> = {
  0: '正常',
  1: '封禁',
}

export const USER_VIP_MAP: Record<number, string> = {
  0: '普通用户',
  1: '会员用户',
}
