// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** sendRegisterCaptcha POST /api/user/captcha */
export async function sendRegisterCaptchaUsingPost(
  body: API.EmailRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/user/captcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteUser POST /api/user/delete */
export async function deleteUserUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getUserDetailById GET /api/user/detail */
export async function getUserDetailByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserDetailByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.UserDetailVO>('/api/user/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** editUserInfo POST /api/user/edit */
export async function editUserInfoUsingPost(
  body: API.UserEditRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/user/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** forgotPassword POST /api/user/forgot/one */
export async function forgotPasswordUsingPost(
  body: API.EmailRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/user/forgot/one', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** restPassword POST /api/user/forgot/two */
export async function restPasswordUsingPost(
  body: API.UserResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/user/forgot/two', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** login POST /api/user/login */
export async function loginUsingPost(body: API.UserLoginRequest, options?: { [key: string]: any }) {
  return request<API.UserDetailVO>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getLoginUserDetail GET /api/user/loginDetail */
export async function getLoginUserDetailUsingGet(options?: { [key: string]: any }) {
  return request<API.UserDetailVO>('/api/user/loginDetail', {
    method: 'GET',
    ...(options || {}),
  })
}

/** userLogout POST /api/user/logout */
export async function userLogoutUsingPost(options?: { [key: string]: any }) {
  return request<boolean>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** getUserPageListAsManage POST /api/user/manage/page */
export async function getUserPageListAsManageUsingPost(
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.PageVOUserVO_>('/api/user/manage/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** register POST /api/user/register */
export async function registerUsingPost(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateUser POST /api/user/update */
export async function updateUserUsingPost(
  body: API.UserUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** uploadAvatar POST /api/user/upload-avatar */
export async function uploadAvatarUsingPost(
  body: {},
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<string>('/api/user/upload-avatar', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
