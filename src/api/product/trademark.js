import request from '@/utils/request.js'

export function getBaseTrademark({ page, limit }) {
  return request({
    url: `/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}

export function postSave({ tmName, logoUrl }) {
  return request({
    url: '/product/baseTrademark/save',
    method: 'post',
    data: {
      tmName, logoUrl
    }
  })
}

export function putUpdate({ id, tmName, logoUrl }) {
  return request({
    url: '/product/baseTrademark/update',
    method: 'put',
    data: {
      id, tmName, logoUrl
    }
  })
}

export function saveOrUpdate({ id, tmName, logoUrl }) {
  if (id) {
    return request({
      url: '/product/baseTrademark/update',
      method: 'put',
      data: {
        id, tmName, logoUrl
      }
    })
  }
  else {
    return request({
      url: '/product/baseTrademark/save',
      method: 'post',
      data: {
        tmName, logoUrl
      }
    })
  }
}

export function deleteRemove(id) {
  return request({
    url: `/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}