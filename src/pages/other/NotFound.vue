<template>
  <n-result
    style="margin-top: 100px"
    status="404"
    title="404 资源不存在"
    description="生活总归带点荒谬"
    size="large"
  >
    <template #footer>
      <n-button @click="$router.push('/')">返回首页</n-button>
    </template>
  </n-result>
</template>
