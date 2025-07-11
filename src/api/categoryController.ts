// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** addCategory POST /api/picture/category/add */
export async function addCategoryUsingPost(
  body: API.CategoryAddRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/category/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteCategory POST /api/picture/category/delete */
export async function deleteCategoryUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/category/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getCategoryPageListAsManage POST /api/picture/category/manage/page */
export async function getCategoryPageListAsManageUsingPost(
  body: API.CategoryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.PageVOCategoryVO_>('/api/picture/category/manage/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateCategory POST /api/picture/category/update */
export async function updateCategoryUsingPost(
  body: API.CategoryUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
