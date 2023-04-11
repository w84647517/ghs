import request from '@/request/request'
//登录
export const login = params =>request.post('/api/login',params)
//获取banner
export const getBanner = (params)=>request.post('/api/banner/list',params)
//获取内容分类管理
export const getContentCategory = params => request.post('/api/contentsclassification/listone',params)
//获取内容分类下二级分类
export const getContentCategory2 = id =>request.post(`/api/contentsclassification/listtwo/${id}`)
//获取内容列表
export const getContentList=params =>request.get('/api/contents/list',params)
//获取四大金刚
export const getModular=params=>request.post('/api/modularclassification/listone',params)
//获取四大金刚二级分类
export const getModular2=id=>request.post(`/api/modularclassification/listtwo/${id}`)
//获取四大金刚内容列表
export const getModularList= params =>request.get('/api/modular/list',params)
//获取四大金刚内容详情
export const getModularById= id =>request.post(`/api/modular/info/${id}`)
//获取我的清单
export const getInventory= params =>request.get('/api/detailedlist/list',params)
//获取清单详情
export const getInventoryById= id =>request.post(`/api/detailedlist/info/${id}`)
//获取内容详情
export const getContentById= id =>request.post(`/api/contents/info/${id}`)
//获取产品分类1
export const getCategory= params =>request.post('/api/classification/listone')

//获取分类下产品
export const getProductById= params => request.get('/api/products/list',params)
//获取产品关联
export const getProductRelevance = id=>request.post(`/api/productsrelation/info/${id}`)
//获取产品详情
export const getProductInfo = id =>request.post(`/api/products/info/${id}`)

//保存清单
export const saveInventory = params =>request.post('/api/detailedlist/save',params)
//删除清单
export const removeInventoryById = ids => request.post('/api/detailedlist/delete',ids)
//导出清单
export const exportInventory= (params) =>request.post(`/api/detailedlist/excel`,params)