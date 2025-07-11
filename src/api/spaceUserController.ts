// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** addSpaceUser POST /api/space/user/add-member */
export async function addSpaceUserUsingPost(
  body: API.SpaceUserAddRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/user/add-member', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteSpaceUser POST /api/space/user/delete */
export async function deleteSpaceUserUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editSpaceUser POST /api/space/user/edit */
export async function editSpaceUserUsingPost(
  body: API.SpaceUserEditRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/user/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** queryUserTeamSpacePermissions POST /api/space/user/get/space-permission */
export async function queryUserTeamSpacePermissionsUsingPost(
  body: API.SpaceUserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.SpaceUserVO[]>('/api/space/user/get/space-permission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
