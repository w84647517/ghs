export default {
	state: {
		productList: []
	},
	getters: {
		getProductList(state) {
			return state.productList
		}
	},
	mutations: {
		updateProduct(state, payload) {
			console.log(state, 'state')
			//获取更新的产品分类
			let category = state.productList.find(item => item.id == payload.id)
			let product = category.foods.find(item => item.id == payload.productId)
			product.count = payload.count
		}
	},
	actions: {
		setCategory({
			state,
			commit
		}, payload) {
			state.productList = payload.map(item =>{
				
				return item
				}
			)
		}
	}
}
