// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** activeSpace POST /api/space/active */
export async function activeSpaceUsingPost(
  body: API.SpaceActiveRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/active', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteSpace POST /api/space/delete */
export async function deleteSpaceUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceDetailBySpaceId GET /api/space/detail */
export async function getSpaceDetailBySpaceIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceDetailBySpaceIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.SpaceDetailVO>('/api/space/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** editSpace POST /api/space/edit */
export async function editSpaceUsingPost(
  body: API.SpaceEditRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getJoinTeamSpacesByLoginUser GET /api/space/join/team-spaces */
export async function getJoinTeamSpacesByLoginUserUsingGet(options?: { [key: string]: any }) {
  return request<API.SpaceTeamDetailVO[]>('/api/space/join/team-spaces', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getSpacePageListAsManage POST /api/space/manage/page */
export async function getSpacePageListAsManageUsingPost(
  body: API.SpaceQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.PageVOSpaceVO_>('/api/space/manage/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPrivateSpaceDetailByLoginUser GET /api/space/private/space-detail */
export async function getPrivateSpaceDetailByLoginUserUsingGet(options?: { [key: string]: any }) {
  return request<API.SpaceDetailVO>('/api/space/private/space-detail', {
    method: 'GET',
    ...(options || {}),
  })
}

/** switchSpaceContext POST /api/space/switch */
export async function switchSpaceContextUsingPost(
  body: API.SpaceSwitchRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/switch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getTeamSpaceDetailByLoginUser GET /api/space/team/space-detail */
export async function getTeamSpaceDetailByLoginUserUsingGet(options?: { [key: string]: any }) {
  return request<API.SpaceTeamDetailVO>('/api/space/team/space-detail', {
    method: 'GET',
    ...(options || {}),
  })
}

/** updateSpace POST /api/space/update */
export async function updateSpaceUsingPost(
  body: API.SpaceUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/space/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
