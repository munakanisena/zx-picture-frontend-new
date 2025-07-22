//openapi 配置文件
import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/utils/request'",
  schemaPath: 'http://localhost:8123/api/v2/api-docs?group=group_1',
  serversPath: './src',
  //设置响应直接为数据
  dataFields: ['data'],
})
