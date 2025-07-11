// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** listHomeCategories GET /api/home/categories */
export async function listHomeCategoriesUsingGet(options?: { [key: string]: any }) {
  return request<API.CategoryVO[]>('/api/home/categories', {
    method: 'GET',
    ...(options || {}),
  })
}

/** pageHomePictures POST /api/home/pictures */
export async function pageHomePicturesUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.PageVOPictureHomeVO_>('/api/home/pictures', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
