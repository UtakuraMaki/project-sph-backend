import request from '@/utils/request.js'

// 获取基础表格数据
export function getTableData({ page, limit }) {
  return request({
    url: `/product/list/${page}/${limit}`,
    method: 'get'
  })
}
// 商品上架
export function onSale(skuId) {
  return request({
    url: `/product/onSale/${skuId}`,
    method: 'get'
  })
}
// 商品下架
export function cancelSale(skuId) {
  return request({
    url: `/product/cancelSale/${skuId}`,
    method: 'get'
  })
}

export function getSkuById(skuId) {
  return request({
    url: `product/getSkuById/${skuId}`,
    method: 'get'
  })
}