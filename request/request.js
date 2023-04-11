import ajax from '@/uni_modules/u-ajax/js_sdk/index.js'    
import Toast from '@/uview-ui/components/u-toast/u-toast.vue'

const config = {
	baseURL:"https://apighs.magiccodekj.com/ghs",
	 "content-type": "application/json",
	  "Accept": "*/*"
}
const instance = ajax.create(config)                           // 创建请求实例
// 添加响应拦截器
instance.interceptors.request.use(config => {
  const token = uni.getStorageSync('token')
uni.showLoading({
	title: '加载中'
});
  token && (config.header['token'] = token)
  return config
})
instance.interceptors.response.use(response => {
  if (response.data.code == 401) {
	uni.reLaunch({
		url:'/pages/login/login'
	})
  }
  uni.hideLoading()
  return response.data
},error => {
	if(error.errMsg=="request:fail "){
		uni.hideLoading()
		uni.showToast({
			title:'数据请求失败',
			icon:'error'
		})
	}
    // 对响应错误做些什么
    return Promise.reject(error)
  })
export default instance   