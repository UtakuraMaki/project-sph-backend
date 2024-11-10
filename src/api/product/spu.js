import request from '@/utils/request.js'

export function getSpuTableData({ page, limit, category3Id }) {
  return request({
    url: `/product/${page}/${limit}`,
    method: 'get',
    params: {
      category3Id
    }
  })
}

export function getSpuById(id) {
  return request({
    url: `/product/getSpuById/${id}`,
    method: 'get'
  })
}

export function getTrademarkList() {
  return request({
    url: '/product/baseTrademark/getTrademarkList',
    method: 'get'
  })
}

export function getSpuImageList(id) {
  return request({
    url: `/product/spuImageList/${id}`,
    method: 'get'
  })
}

export function getBaseSaleAttrList() {
  return request({
    url: '/product/baseSaleAttrList',
    method: 'get'
  })
}

export function postSaveOrUpdateSpuInfo(data) {
  if (data.id) {
    return request({
      url: '/product/updateSpuInfo',
      method: 'post',
      data
    })
  }
  else {
    return request({
      url: '/product/saveSpuInfo',
      method: 'post',
      data
    })
  }
}

export function deleteSpu(spuId) {
  return request({
    url: `/product/deleteSpu/${spuId}`,
    method: 'delete'
  })
}

export function getSpuSaleAttrList(spuId) {
  return request({
    url: `/product/spuSaleAttrList/${spuId}`,
    method: 'get'
  })
}

export function postSaveSkuInfo(data) {
  return request({
    url: '/product/saveSkuInfo',
    method: 'post',
    data
  })
}

export function getFindBySpuId(spuId) {
  return request({
    url: `product/findBySpuId/${spuId}`,
    method: 'get'
  })
}