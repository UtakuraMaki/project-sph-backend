import request from '@/utils/request.js'

export function getBaseTrademark({ page, limit }) {
  return request({
    url: `/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}