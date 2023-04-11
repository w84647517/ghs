import vue from 'vue'
import Vuex from 'vuex'
import product from '@/store/module/product.js'
import cart from '@/store/module/cart.js'
vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		product,
		cart
	},
	state:{
		isTj:true
	},
	getters:{
		getTjFlag(state){
			return state.isTj
		}
	},
	mutations:{
		setTjFlag(state,payload){
			state.isTj=payload
		}
	}
})

export default store