import request from '@/utils/request.js'
// 获取一级分类数据接口：/admin/product/getCategory1
export function getCategory1() {
  return request({
    url: '/product/getCategory1',
    method: 'get'
  })
}
// 获取二级分类数据接口：/admin/product/getCategory2/{category1Id}
export function getCategory2(category1Id) {
  return request({
    url: `/product/getCategory2/${category1Id}`,
    method: 'get'
  })
}
// 获取三级分类数据接口：/admin/product/getCategory3/{category2Id}
export function getCategory3(category2Id) {
  return request({
    url: `/product/getCategory3/${category2Id}`,
    method: 'get'
  })
}
// 获取平台属性数据接口：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export function getAttrInfoList({ category1Id, category2Id, category3Id }) {
  return request({
    url: `/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}
// 添加属性名称与属性值列表接口：/admin/product/saveAttrInfo
/*
{
  attrName: String,
  attrValueList: [
    {
      attrId: Number,
      valueName: String
    }
  ],
  categoryId: Number,
  categoryLevel: Number,
}
*/
export function postSaveAttrInfo(data) {
  return request({
    url: '/product/saveAttrInfo',
    method: 'post',
    data
  })
}