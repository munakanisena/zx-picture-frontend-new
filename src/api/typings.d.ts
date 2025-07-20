declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseCreateOutPaintingTaskResponse_ = {
    code?: number
    data?: CreateOutPaintingTaskResponse
    message?: string
  }

  type BaseResponseGetOutPaintingTaskResponse_ = {
    code?: number
    data?: GetOutPaintingTaskResponse
    message?: string
  }

  type BaseResponseListCapturePictureResult_ = {
    code?: number
    data?: CapturePictureResult[]
    message?: string
  }

  type BaseResponseListCategoryVO_ = {
    code?: number
    data?: CategoryVO[]
    message?: string
  }

  type BaseResponseListSearchPictureResult_ = {
    code?: number
    data?: SearchPictureResult[]
    message?: string
  }

  type BaseResponseListSpaceCategoryAnalyzeResponse_ = {
    code?: number
    data?: SpaceCategoryAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceSizeAnalyzeResponse_ = {
    code?: number
    data?: SpaceSizeAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceTagAnalyzeResponse_ = {
    code?: number
    data?: SpaceTagAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceTeamDetailVO_ = {
    code?: number
    data?: SpaceTeamDetailVO[]
    message?: string
  }

  type BaseResponseListSpaceUserAnalyzeResponse_ = {
    code?: number
    data?: SpaceUserAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceUserVO_ = {
    code?: number
    data?: SpaceUserVO[]
    message?: string
  }

  type BaseResponseListSpaceVO_ = {
    code?: number
    data?: SpaceVO[]
    message?: string
  }

  type BaseResponsePageVOCategoryVO_ = {
    code?: number
    data?: PageVOCategoryVO_
    message?: string
  }

  type BaseResponsePageVOPictureHomeVO_ = {
    code?: number
    data?: PageVOPictureHomeVO_
    message?: string
  }

  type BaseResponsePageVOPictureVO_ = {
    code?: number
    data?: PageVOPictureVO_
    message?: string
  }

  type BaseResponsePageVOSpaceVO_ = {
    code?: number
    data?: PageVOSpaceVO_
    message?: string
  }

  type BaseResponsePageVOUserVO_ = {
    code?: number
    data?: PageVOUserVO_
    message?: string
  }

  type BaseResponsePictureDetailVO_ = {
    code?: number
    data?: PictureDetailVO
    message?: string
  }

  type BaseResponseSpaceDetailVO_ = {
    code?: number
    data?: SpaceDetailVO
    message?: string
  }

  type BaseResponseSpaceTeamDetailVO_ = {
    code?: number
    data?: SpaceTeamDetailVO
    message?: string
  }

  type BaseResponseSpaceUsageAnalyzeResponse_ = {
    code?: number
    data?: SpaceUsageAnalyzeResponse
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUserDetailVO_ = {
    code?: number
    data?: UserDetailVO
    message?: string
  }

  type BaseResponseUserPictureStatsVO_ = {
    code?: number
    data?: UserPictureStatsVO
    message?: string
  }

  type capturePictureRequest = {
    captureCount?: number
    captureSource?: string
    namePrefix?: string
    randomSeed?: number
    searchText?: string
  }

  type CapturePictureResult = {
    captureUrl?: string
    handleCaptureUrl?: string
    pictureName?: string
  }

  type CategoryAddRequest = {
    name?: string
    parentId?: number
  }

  type CategoryQueryRequest = {
    current?: number
    id?: number
    name?: string
    pageSize?: number
    parentId?: number
    sortField?: string
    sortOrder?: boolean
    useNum?: number
    userId?: number
  }

  type CategoryUpdateRequest = {
    id?: number
    name?: string
    parentId?: number
    useNum?: number
  }

  type CategoryVO = {
    createTime?: string
    id?: number
    name?: string
    parentId?: number
    useNum?: number
    userId?: number
  }

  type CreateOutPaintingTaskResponse = {
    code?: string
    message?: string
    output?: Output
    requestId?: string
  }

  type DeleteRequest = {
    id?: number
    spaceId?: number
  }

  type EmailRequest = {
    userEmail?: string
  }

  type GetOutPaintingTaskResponse = {
    output?: Output1
    requestId?: string
  }

  type getPictureDetailByIdUsingGETParams = {
    /** pictureId */
    pictureId: number
  }

  type getSpaceDetailBySpaceIdUsingGETParams = {
    /** spaceId */
    spaceId?: number
  }

  type getTeamSpaceMembersBySpaceIdUsingGETParams = {
    /** spaceId */
    spaceId?: number
  }

  type getUserDetailByIdUsingGETParams = {
    /** userId */
    userId?: number
  }

  type Output = {
    taskId?: string
    taskStatus?: string
  }

  type Output1 = {
    code?: string
    endTime?: string
    message?: string
    outputImageUrl?: string
    requestId?: string
    scheduledTime?: string
    submitTime?: string
    taskId?: string
    taskMetrics?: TaskMetrics
    taskStatus?: string
    usage?: Usage
  }

  type PageVOCategoryVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: CategoryVO[]
    total?: number
  }

  type PageVOPictureHomeVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: PictureHomeVO[]
    total?: number
  }

  type PageVOPictureVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: PictureVO[]
    total?: number
  }

  type PageVOSpaceVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: SpaceVO[]
    total?: number
  }

  type PageVOUserVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: UserVO[]
    total?: number
  }

  type Parameters = {
    addWatermark?: boolean
    angle?: number
    bestQuality?: boolean
    bottomOffset?: number
    leftOffset?: number
    limitImageSize?: boolean
    outputRatio?: string
    rightOffset?: number
    topOffset?: number
    xScale?: number
    yScale?: number
  }

  type PictureCategory = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    name?: string
    parentId?: number
    updateTime?: string
    useNum?: number
    userId?: number
  }

  type PictureDetailVO = {
    categoryId?: number
    categoryName?: string
    collectQuantity?: number
    compressFormat?: string
    compressUrl?: string
    createTime?: string
    id?: number
    isCollect?: boolean
    isLike?: boolean
    likeQuantity?: number
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originSize?: number
    originWidth?: number
    picDesc?: string
    picName?: string
    reviewStatus?: number
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    userAvatar?: string
    userId?: number
    userName?: string
  }

  type PictureEditRequest = {
    categoryId?: number
    id?: number
    picDesc?: string
    picName?: string
    spaceId?: number
    tags?: string[]
  }

  type PictureExtendRequest = {
    parameters?: Parameters
    pictureId?: number
  }

  type PictureHomeVO = {
    categoryId?: number
    collectQuantity?: number
    compressUrl?: string
    id?: number
    isCollect?: boolean
    isLike?: boolean
    likeQuantity?: number
    picName?: string
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    userAvatar?: string
    userId?: number
    userName?: string
  }

  type PictureInteractionRequest = {
    id?: number
    interactionStatus?: number
    interactionType?: number
  }

  type PictureQueryRequest = {
    categoryId?: number
    current?: number
    endEditTime?: string
    id?: number
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originWidth?: number
    pageSize?: number
    picDesc?: string
    picName?: string
    reviewMessage?: string
    reviewStatus?: number
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: boolean
    spaceId?: number
    startEditTime?: string
    tags?: string[]
    userId?: number
  }

  type PictureReviewRequest = {
    id?: number
    idList?: number[]
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureUpdateRequest = {
    categoryId?: number
    id?: number
    picDesc?: string
    picName?: string
    tags?: string[]
  }

  type PictureUploadRequest = {
    id?: number
    pictureName?: string
    pictureUrl?: string
    spaceId?: number
  }

  type PictureVO = {
    categoryId?: number
    compressFormat?: string
    compressUrl?: string
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originSize?: number
    originUrl?: string
    originWidth?: number
    picDesc?: string
    picName?: string
    pictureCategory?: PictureCategory
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    updateTime?: string
    userId?: number
    userInfo?: UserInfo
  }

  type queryPictureExtendTaskUsingGETParams = {
    /** taskId */
    taskId?: string
  }

  type SearchPictureByColorRequest = {
    current?: number
    pageSize?: number
    picColor?: string
    sortField?: string
    sortOrder?: boolean
    spaceId?: number
  }

  type SearchPictureByPictureRequest = {
    pictureId?: number
    randomSeed?: number
    searchCount?: number
  }

  type SearchPictureResult = {
    fromUrl?: string
    thumbUrl?: string
  }

  type SpaceActiveRequest = {
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
  }

  type SpaceCategoryAnalyzeRequest = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceCategoryAnalyzeResponse = {
    categoryName?: string
    count?: number
    totalSize?: number
  }

  type SpaceDetailVO = {
    createTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    usedCount?: number
    usedSize?: number
    userId?: number
  }

  type SpaceEditRequest = {
    id?: number
    spaceName?: string
  }

  type SpaceQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: boolean
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  type SpaceSizeAnalyzeRequest = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceSizeAnalyzeResponse = {
    count?: number
    sizeRange?: string
  }

  type SpaceSwitchRequest = {
    spaceId?: number
  }

  type SpaceTagAnalyzeRequest = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceTagAnalyzeResponse = {
    count?: number
    tagName?: string
  }

  type SpaceTeamDetailVO = {
    createTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    usedCount?: number
    usedSize?: number
    userId?: number
  }

  type SpaceUpdateRequest = {
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
  }

  type SpaceUsageAnalyzeRequest = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceUsageAnalyzeResponse = {
    countUsageRatio?: number
    maxCount?: number
    maxSize?: number
    sizeUsageRatio?: number
    usedCount?: number
    usedSize?: number
  }

  type SpaceUserAddRequest = {
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserAnalyzeRequest = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
    timeDimension?: string
    userId?: number
  }

  type SpaceUserAnalyzeResponse = {
    count?: number
    period?: string
  }

  type SpaceUserEditRequest = {
    id?: number
    spaceId?: number
    spaceRole?: string
  }

  type SpaceUserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: boolean
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserVO = {
    createTime?: string
    editTime?: string
    id?: number
    spaceId?: number
    spaceRole?: string
    userDetailVO?: UserDetailVO
  }

  type SpaceVO = {
    createTime?: string
    editTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    permissionList?: string[]
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    updateTime?: string
    usedCount?: number
    usedSize?: number
    user?: UserDetailVO
    userId?: number
  }

  type TaskMetrics = {
    failed?: number
    succeeded?: number
    total?: number
  }

  type uploadPictureByFileToPublicUsingPOSTParams = {
    id?: number
    pictureName?: string
    pictureUrl?: string
    spaceId?: number
  }

  type uploadPictureByFileToSpaceUsingPOSTParams = {
    id?: number
    pictureName?: string
    pictureUrl?: string
    spaceId?: number
  }

  type Usage = true

  type UserDetailVO = {
    avatar?: string
    createTime?: string
    id?: number
    introduction?: string
    isVip?: number
    name?: string
    role?: string
    vipNumber?: number
  }

  type UserEditRequest = {
    id?: number
    introduction?: string
    name?: string
    phone?: string
  }

  type UserInfo = {
    avatar?: string
    createTime?: string
    editTime?: string
    email?: string
    id?: number
    introduction?: string
    isDelete?: number
    isDisabled?: number
    isVip?: number
    name?: string
    password?: string
    phone?: string
    role?: string
    updateTime?: string
    vipNumber?: number
  }

  type UserLoginRequest = {
    emailOrUsername?: string
    password?: string
  }

  type UserPictureStatsVO = {
    collectCount?: number
    uploadCount?: number
  }

  type UserQueryRequest = {
    current?: number
    email?: string
    id?: number
    isDisabled?: number
    isVip?: number
    name?: string
    pageSize?: number
    phone?: string
    role?: string
    sortField?: string
    sortOrder?: boolean
    vipNumber?: number
  }

  type UserRegisterRequest = {
    captcha?: string
    confirmPassword?: string
    email?: string
    name?: string
    password?: string
  }

  type UserResetPasswordRequest = {
    captcha?: string
    confirmPassword?: string
    email?: string
    newPassword?: string
  }

  type UserUpdateRequest = {
    avatar?: string
    email?: string
    id?: number
    introduction?: string
    isDisabled?: number
    isVip?: number
    name?: string
    password?: string
    phone?: string
    role?: string
    vipNumber?: number
  }

  type UserVO = {
    avatar?: string
    createTime?: string
    editTime?: string
    email?: string
    id?: number
    introduction?: string
    isDisabled?: number
    isVip?: number
    name?: string
    password?: string
    phone?: string
    role?: string
    updateTime?: string
    vipNumber?: number
  }
}
