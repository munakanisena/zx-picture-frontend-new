// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** capturePicture POST /api/picture/capture */
export async function capturePictureUsingPost(
  body: API.capturePictureRequest,
  options?: { [key: string]: any }
) {
  return request<API.CapturePictureResult[]>('/api/picture/capture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deletePictureById POST /api/picture/delete */
export async function deletePictureByIdUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPictureDetailById GET /api/picture/detail */
export async function getPictureDetailByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureDetailByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.PictureDetailVO>('/api/picture/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** pictureDownload POST /api/picture/download */
export async function pictureDownloadUsingPost(
  body: API.PictureInteractionRequest,
  options?: { [key: string]: any }
) {
  return request<string>('/api/picture/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editPicture POST /api/picture/edit */
export async function editPictureUsingPost(
  body: API.PictureEditRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** createPictureExtendTask POST /api/picture/extend */
export async function createPictureExtendTaskUsingPost(
  body: API.PictureExtendRequest,
  options?: { [key: string]: any }
) {
  return request<API.CreateOutPaintingTaskResponse>('/api/picture/extend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** queryPictureExtendTask GET /api/picture/extend/query */
export async function queryPictureExtendTaskUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryPictureExtendTaskUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.GetOutPaintingTaskResponse>('/api/picture/extend/query', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** likeOrCollection POST /api/picture/interaction */
export async function likeOrCollectionUsingPost(
  body: API.PictureInteractionRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/interaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPicturePageListAsManage POST /api/picture/manage/page */
export async function getPicturePageListAsManageUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.PageVOPictureVO_>('/api/picture/manage/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPicturePageListAsPersonSpace POST /api/picture/personSpace/page */
export async function getPicturePageListAsPersonSpaceUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.PageVOPictureVO_>('/api/picture/personSpace/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** reviewPicture POST /api/picture/review */
export async function reviewPictureUsingPost(
  body: API.PictureReviewRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** searchPictureByPicture POST /api/picture/search/by-picture */
export async function searchPictureByPictureUsingPost(
  body: API.SearchPictureByPictureRequest,
  options?: { [key: string]: any }
) {
  return request<API.ImageSearchResult[]>('/api/picture/search/by-picture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** searchPictureByPicColor POST /api/picture/search/color */
export async function searchPictureByPicColorUsingPost(
  body: API.SearchPictureByColorRequest,
  options?: { [key: string]: any }
) {
  return request<API.PictureVO[]>('/api/picture/search/color', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updatePicture POST /api/picture/update */
export async function updatePictureUsingPost(
  body: API.PictureUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** uploadPictureByCapture POST /api/picture/upload/capture */
export async function uploadPictureByCaptureUsingPost(
  body: API.PictureUploadRequest,
  options?: { [key: string]: any }
) {
  return request<boolean>('/api/picture/upload/capture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** uploadPictureByFile POST /api/picture/upload/file */
export async function uploadPictureByFileUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadPictureByFileUsingPOSTParams,
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

  return request<API.PictureDetailVO>('/api/picture/upload/file', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** uploadPictureByUrl POST /api/picture/upload/url */
export async function uploadPictureByUrlUsingPost(
  body: API.PictureUploadRequest,
  options?: { [key: string]: any }
) {
  return request<API.PictureDetailVO>('/api/picture/upload/url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
