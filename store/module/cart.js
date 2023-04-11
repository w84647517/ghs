export default {
	state: {
		//购物车
		cartList: []
	},
	getters: {
		getCartList(state) {
			return state.cartList
		}
	},
	mutations: {
		setCartList(state, payload) {
			state.cartList = payload
		},
		clearCart(state) {
			state.cartList = []
		},
		//全部选中
		updateSelectAll(state, payload) {
			//遍历所有产品添加选中状态

			state.cartList = state.cartList.map(item => {
				item.selected = payload
				item.products.map(pro => {
					pro.selected = payload
					return pro
				})
				return item
			})

		},
		//更新购物车选中状态
		updateSelect(state, payload) {
			let category = state.cartList.length ? state.cartList.find(item => item.id == payload.category.id) : null
			//1分类  2产品
			//分类全选
			if (payload.type == '1') {

				category.selected = payload.selected
				category.products = category.products.map(item => {
					item.selected = payload.selected
					return item
				})
			}
			//产品选择
			if (payload.type == '2') {

				state.cartList = state.cartList.map(item => {
					if (item.id == payload.category.id) {
						item.products.map(pro => {
							if (pro.id == payload.product.id) {
								pro.selected = payload.selected
							}
							return pro
						})
					}
					//判断产品是否被全部选中
					if (item.products.length == item.products.filter(p => p.selected).length) {
						item.selected = true
					} else {
						item.selected = false
					}
					return item
				})

			}
		},
		//更新商品比例
		updateScale(state, payload) {
			let category = state.cartList.length ? state.cartList.find(item => item.id == payload.category.id) : null
			let product = category ? category.products.find(item => item.id == payload.product.id) : null
			product.scale = payload.scale
		},
		updateCartCount(state, payload) {
			//购物车无分类  添加分类添加商品
			let category = state.cartList.length ? state.cartList.find(item => item.id == payload.category.id) : null
			let product = category ? category.products.find(item => item.id == payload.product.id) : null
			console.log(category, product, 'sss')
			if (!category) {
				
				const data = {
					...payload.category,
					
					products: [{...payload.product,count:1}]
				}
				state.cartList.push(data)
			}
			if (category && product) {
				product.count = product.count + 1
			}
			if (category && !product) {
				category.products.push({
					...payload.product,
					count: 1
				})
			} 

		},
		//更新购物车
		updateCart(state, payload) {
			//购物车无分类  添加分类添加商品
			let category = state.cartList.length ? state.cartList.find(item => item.id == payload.category.id) : null
			let product = category ? category.products.find(item => item.id == payload.product.id) : null
			if (!category) {
				const data = {
					...payload.category,
					products: [payload.product]
				}
				state.cartList.push(data)
			}
			// return
			//购物车分类存在商品存在直接更新
			if (category && product) {
				const productIndex = category.products.findIndex(item => item.id == product.id)
				category.products[productIndex] = product
				product.count = payload.count
				if (payload.count == 0) {
					//等于删除商品
					category.products = category.products.filter(item => item.count > 0)
					//分类没有产品 删除分类
					if (category.products.length == 0) {
						const categoryIndex = state.cartList.findIndex(item => item.id == category.id)
						state.cartList.splice(categoryIndex, 1)
					}
				}

			}
			//分类存在商品不存在
			if (category && !product) {
				category.products.push(payload.product)
			}
		}
	},
	actions: {

	}
}
