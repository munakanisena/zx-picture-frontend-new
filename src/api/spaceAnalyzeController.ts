// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** analyzeSpaceCategory POST /api/analyze/space/picture-categories */
export async function analyzeSpaceCategoryUsingPost(
  body: API.SpaceCategoryAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.SpaceCategoryAnalyzeResponse[]>('/api/analyze/space/picture-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** analyzeSpaceRank GET /api/analyze/space/picture-rank */
export async function analyzeSpaceRankUsingGet(options?: { [key: string]: any }) {
  return request<API.SpaceVO[]>('/api/analyze/space/picture-rank', {
    method: 'GET',
    ...(options || {}),
  })
}

/** analyzeSpaceSize POST /api/analyze/space/picture-size */
export async function analyzeSpaceSizeUsingPost(
  body: API.SpaceSizeAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.SpaceSizeAnalyzeResponse[]>('/api/analyze/space/picture-size', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** analyzeSpaceTags POST /api/analyze/space/picture-tags */
export async function analyzeSpaceTagsUsingPost(
  body: API.SpaceTagAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.SpaceTagAnalyzeResponse[]>('/api/analyze/space/picture-tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** analyzeSpaceUsed POST /api/analyze/space/picture-usage */
export async function analyzeSpaceUsedUsingPost(
  body: API.SpaceUsageAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.SpaceUsageAnalyzeResponse>('/api/analyze/space/picture-usage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** analyzeSpaceUserAction POST /api/analyze/space/user-action */
export async function analyzeSpaceUserActionUsingPost(
  body: API.SpaceUserAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.SpaceUserAnalyzeResponse[]>('/api/analyze/space/user-action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
