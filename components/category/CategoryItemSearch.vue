<template>
	<view class="product u-m-b-30 u-border">
		<view class="u-flex u-col-top u-flex-nowrap">
			<view class="u-row-left u-flex-4 product-left"  @tap="toDetail"><image :src="productItem.imgs" mode="aspectFill"></image>
			
			</view>
			<view class="u-row-right u-flex-8 product-right u-p-l-15 ">
				<view class="u-title u-line-1 right-title u-font-md u-font-13"  @tap.stop.prevent="toDetail"><u-tag class="tag u-p-r-15" :text="productItem.classificationIdTwoName" shape="square" mode="dark" size="mini"/>{{ productItem.name }}</view>
				<view class="u-title u-line-3 right-desc u-font-12"  @tap.stop.prevent="toDetail">{{ productItem.keywords }}</view>
				<view class="product-bottom u-flex u-row-between u-p-r-15">
					<view class="product-price">
						<text class="unit">￥</text>
						<text class="price">{{ productItem.unitPrice }}</text>
					</view>
					<view class="product-cart">
						<u-button hover-class="none" icon="cart" :throttle-time="0" shape="circle" :custom-style="customStyle" :ripple="false" size="mini" @click="valChange({value:1}),relevance(productItem)" v-if="productItem.count == 0">
							加入购物车
						</u-button>
				<u-number-box v-show="productItem.count > 0" :value="productItem.count"  @change="valChange"></u-number-box>
						<!-- <uni-number-box :value="productItem.count" @change="valChange" v-show="productItem.count > 0" @blur="numberBoxBlur"></uni-number-box> -->
					</view>
				</view>
				</view>
				
			</view>
	
	

	</view>
</template>

<script>
import { mapMutations ,mapGetters} from 'vuex';

export default {
	name: 'CategoryItem',
	props: {
		category: {
			type: Object,
			default: () => {
				return {};
			}
		},
		productItem: {
			type: Object,
			default: () => {
				return {
					
				};
			}
		}
	},
	data() {
		return {
			visible:false,
			customStyle: {
				// 注意驼峰命名，并且值必须用引号包括，因为这是对象
				color: 'white',
				borderRadius: '40rpx',
				padding: '2rpx 20rpx',
				backgroundColor: '#5190FF'
			}
		};
	},

	methods: {
		...mapMutations(['updateCart']),
		toDetail(){
			uni.navigateTo({
				url:`../../pages/product/productDetail?id=${this.productItem.id}&count=${this.productItem.count}`,
			})
		},
		relevance(item){
			if(this.getTjFlag){
				this.$emit('openModal',item)
			}
			
		},
		valChange(val) {
		
			//更改数量
			this.$emit('update:value',val.value)
			this.$nextTick(() => {
				this.updateCart({
					category: this.category,
					product: this.productItem,
					count: val.value
				});
			});
		},
		numberBoxBlur(e) {
			const val = e.target.value
			if (val == '') {
				this.$emit('update:value',0)
				this.$nextTick(() => {
					this.updateCart({
						category: this.category,
						product: this.productItem,
						count: 0
					});
				});
			}
		}
	},
	computed:{
	...mapGetters(['getTjFlag'])	
	},
	created() {
		// console.log(this.$store);
	}
};
</script>

<style lang="scss" scoped>

.product {
	margin-top: 10rpx;
	width: 100%;
	&-left {
		height: 200rpx;
		width: 200rpx;
		position: relative;
		.tag{
			position: absolute;
			left:0;top:0;
		}
		image {
			height: 100%;
			width: 100%;
		}
	}
	&-right {
		.right-title,
		.right-desc {
			width: 470rpx;
			
			color: $uni-text-color;
		}
		.right-desc {
			height:108rpx;
			color: $uni-text-color-grey;
		}
	}
	&-price {
		font-weight: bold;
		.unit {
			color: $main-unit-color;
		}
		.price {
			color: $main-unit-color;
			font-size: 30rpx;
		}
	}
	&-cart {
	}
}
</style>
