<template>
	<view>
		<u-popup v-model="visible" mode="center" border-radius="14" :mask-close-able="false" :closeable="true" z-index="9999999">
			<template slot="">
				<view class="u-font-bold u-font-25" style="text-align: center; height: 100rpx;line-height: 100rpx;">关联产品</view>
				<view class="tj u-p-b-20">
					<scroll-view class="scroll-view_H" :scroll-y="true"  @scrolltolower="loadMore" :lower-threshold="50" scroll-top="-10" :scroll-top="scrollTop">
						<view class="tj-box u-flex u-col-top u-m-t-20" v-for="(item,index) in productList" :key="index">
							<view class="tj-left"><image class="pic" :src="item.imgs" mode="scaleToFill"></image></view>
							<view class=" tj-right u-p-l-15">
								<view class="u-line-2 title">{{item.name}}</view>
								<view class="u-flex u-row-between" style="margin-top:28rpx;">
									<view class="">
										<text class="unit">￥</text>
										<text class="price u-font-bold u-font-14">{{item.unitPrice}}</text>
									</view>
									<view class="u-m-r-10">
										<u-button hover-class="none" :throttle-time="0" shape="circle" :custom-style="customStyle" :ripple="false" size="mini" @click="addCart(item)">
											加入购物车
										</u-button>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="" @tap="onAddAll" style="text-align: center;color:#5190FF;height:80rpx;line-height: 80rpx;">
					一键添加
				</view>
			</template>
		</u-popup>
	</view>
</template>

<script>
import { getProductRelevance } from '@/api';
import {mapMutations,mapGetters} from 'vuex'
export default {
	name: 'productRelevance',
	data() {
		return {
			scrollTop:0,
			visible: false,
			productList: [],
			customStyle: {
				// 注意驼峰命名，并且值必须用引号包括，因为这是对象
				color: 'white',
				borderRadius: '40rpx',
				padding: '5rpx 20rpx',
				backgroundColor: '#5190FF'
			}
		};
	},
	computed:{
	...mapGetters(['getProductList','getCartList']),
	},
	methods: {
		...mapMutations(['updateCartCount']),
		onAddAll(){
			this.productList.forEach(item=>{
				this.addCart(item)
			})
			uni.showToast({
				title:'已全部添加到购物车',
				icon:'none'
			})
				this.visible=false
		},
		async open(id) {
			
			let result = await getProductRelevance(id);
			this.productList=result.productsRelationEntityList.map(item=>item.productsEntity)
			if(this.productList.length>0){
				this.visible = true;
			}
			console.log(this.productList,'关联产品')
		},
		loadMore(){},
		addCart(item){
			this.updateCartCount({
				category:this.getProductList.find(product=>item.classificationIdOne==product.id),
				product:item
			})
			console.log(this.getProductList.find(product=>item.classificationIdOne==product.id),'关联')
			console.log(item,'关联')
			this.$emit('syncCount')
			uni.showToast({
				title:'添加成功',
				icon:'none'
			})
		},
		close() {
			this.visible = false;
		},
		fetchList() {}
	}
};
</script>

<style lang="scss">
.tj {
	padding: 0 30rpx;
	width: 600rpx;
	.scroll-view_H{
		height:600rpx;
	}
	&-left {
		width: 150rpx;
		height: 150rpx;
		.pic {
			border-radius: 10rpx;
			height: 100%;
			width: 100%;
		}
	}
	&-right {
		width: 390rpx;
		.title {
			height: 75rpx;
			overflow: hidden;
		}
		.unit {
			color: $main-unit-color;
		}
		.price {
			color: $main-unit-color;
			font-size: 30rpx;
		}
		.button {
		}
	}
}
</style>
