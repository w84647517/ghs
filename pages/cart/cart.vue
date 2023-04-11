<template>
	<view class="cart">
		<view class="cart-container" v-if="getCartList.length">
			<view class="cart-item" v-for="(category, index) in getCartList" :key="category.id">
				<view class="cart-item-header u-padding-15 u-border-bottom">
					<view class="u-flex">
						<view class="u-font-md">
							<u-checkbox @input="categorySelect($event, category)" :value="category.selected" icon-size="20" shape="circle">{{ category.name }}</u-checkbox>
						</view>
					</view>
				</view>
				<view class="cart-item-list">
					<u-swipe-action
						@click="swiperClick(category, product)"
						@open="swiperOpen(category, product)"
						class="cart-item"
						:show="product.show"
						:index="index"
						v-for="product in category.products"
						:key="product.id"
						:options="options"
					>
						<view class="u-flex cart-item-product u-padding-15">
							<view class="cart-item-product-left">
								<u-checkbox @input="productSelect($event, category, product)" :value="product.selected" icon-size="20" shape="circle"></u-checkbox>
							</view>
							<view class="cart-item-product-right">
								<view class="u-flex">
									<view class="u-flex-4 " style="height:202rpx;"><image :src="product.imgs" mode="aspectFill"></image></view>
									<view class="u-flex-8 u-p-l-15 " style="height:252rpx;">
										<view class="u-line-1 text" style="max-width: 390rpx;">{{ product.name }}</view>
										<input type="text" v-model="product.remark" placeholder="请填写备注"/>
										<view class="scale u-flex u-row-between u-p-t-15 u-p-b-15 ">
											<view class="dqbl u-font-sm">
												当前比例:
												<text class="u-p-l-15">{{ product.scale || 0 }}</text>
											</view>
											<view class="u-font-sm blsz" @click="onScale(category, product)">比例设置</view>
										</view>
										
										<view class="price u-flex u-row-between u-p-t-15">
											<view>
												<text class="unit">￥</text>
												<text class="number">
													{{ ((Number(product.unitPrice * (product.scale / 100)) + Number(product.unitPrice)) * Number(product.count)).toFixed(2) }}
												</text>
											</view>
											<view class="">
												<uni-number-box :value="product.count" :max="9999" @change="numberChange($event, category, product)" :min="1"></uni-number-box>
											</view>
										</view>
									
										
									</view>
									
								</view>
							</view>
						</view>
					</u-swipe-action>
				</view>
			</view>
		</view>
		<u-empty mode="car" v-else></u-empty>
		<view class="cart-fixed-bottom u-border-top" v-if="getCartList.length">
			<view class="u-flex container u-row-between">
				<view class=""><u-checkbox v-model="isAllCheck" icon-size="20" shape="circle" @change="allCheck">全选</u-checkbox>
						<text class="u-p-5 u-font-30" @click="onCLear" v-if="isAllCheck" style="color:#5190FF;vertical-align: middle;">
							清空
						</text>
				</view>
				
				<view class="scqd">
					<text class="u-font-sm">总计:</text>
					<text class="unit">￥{{ allPrice }}</text>
					<u-button hover-class="none"  :throttle-time="0" :ripple="false" :customStyle="customStyle" shape="circle" size="mini" @click="toInventory">生成清单</u-button>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="base" type="info" title="设置倍率" @close="scaleCancel" @confirm="scaleConfirm" :duration="2000" :before-close="true">
				<template>
					<u-number-box :min="0" :max="9999" v-model="currentScale" :positive-integer="false"  :step="0.1"></u-number-box>
				</template>
			</uni-popup-dialog>
		</uni-popup>
		<u-modal v-model="showModal" @confirm="modalConfirm" content="是否删除产品" :show-cancel-button="true" confirm-color="red"></u-modal>
	</view>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
	data() {
		return {
			currentScale: 0,
			cSelect: false,
			pSelect: false,
			showModal: false,
			closeData: {},
			scaleData: {},
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			customStyle: {
				// 注意驼峰命名，并且值必须用引号包括，因为这是对象
				color: 'white',
				borderRadius: '40rpx',

				backgroundColor: '#5190FF'
			},
			isAllCheck: false,
			check: false
		};
	},
	computed: {
		...mapGetters(['getCartList']),
		allPrice() {
			let price = 0;
			this.getCartList.map(item => {
				item.products.map(product => {
					if (product.selected) {
						price += (Number(product.unitPrice * (product.scale / 100)) + Number(product.unitPrice)) * Number(product.count);
					}
				});
			});
			return price.toFixed(2);
		}
	},
	filters: {
		formatePrice(value) {
			console.log(value);
			return value.toFixed(2);
		}
	},
	methods: {
		
		...mapMutations(['updateCart', 'updateScale', 'updateSelect', 'updateSelectAll','clearCart']),
		scaleChange(value){
			this.currentScale=value.value
		},
		onCLear(){
			this.clearCart()
			this.isAllCheck=false
		},
		toInventory() {
			console.log(this.allPrice);
			if (this.allPrice == 0.0) {
				uni.showToast({
					title: '请选择产品生成清单',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: '../product/productInventory',
				fail: e => {
					console.log(e, 'ee');
				}
			});
		},
		allCheck(val) {
			this.updateSelectAll(val.value);
		},
		categorySelect(val, category) {
	
			// return
			this.updateSelect({
				type: 1,
				category,
				selected: val
			});
			//全选联动
			let hasUnSelect=true
			this.getCartList.forEach(item=>{
				 item.products.forEach(product=>{
					 if(!product.selected){
						 hasUnSelect=false
						 this.isAllCheck=hasUnSelect
						 throw Error();
					 }else{
						 hasUnSelect=true
					 }
				 })
			})
			this.isAllCheck=hasUnSelect
		},
		productSelect(val, category, product) {
			console.log(val, category, product);
			this.updateSelect({
				type: 2,
				category,
				product,
				selected: val
			});
			let hasUnSelect=true
			this.getCartList.forEach(item=>{
				 item.products.forEach(product=>{
					 if(!product.selected){
						 hasUnSelect=false
						 this.isAllCheck=hasUnSelect
						 throw Error();
					 }else{
						 hasUnSelect=true
					 }
				 })
			})
			this.isAllCheck=hasUnSelect
		},
		numberChange(value, category, product) {
			this.updateCart({
				category,
				product,
				count: value
			});
		},
		onScale(category, product) {
			this.$refs.popup.open();
			this.scaleData = {
				category,
				product
			};
			this.currentScale = product.scale;
		},
		scaleCancel() {
			this.$refs.popup.close();
			setTimeout(() => {
				this.currentScale = 0;
			}, 500);
		},
		scaleConfirm(e) {
			const { category, product } = this.scaleData;

			this.updateScale({
				category,
				product,
				scale: this.currentScale
			});
			this.scaleCancel();
		},
		swiperClick(category, product) {
			this.closeData = {
				category,
				product
			};
			this.showModal = true;
		},
		modalConfirm() {
			const { category, product } = this.closeData;
			this.updateCart({
				category: category,
				product: product,
				count: 0
			});
			this.showModal = false;
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		swiperOpen(category, product) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			// console.log('open', index);
		}
	}
};
</script>

<style lang="scss" scoped>
.cart {
	.cart-fixed-bottom {
		z-index: 999;
		background-color: white;
		padding: 0 20rpx;
		height: 80rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		left: 0;
		.container {
			height: 100%;
			.scqd {
				.unit {
					padding-right: 20rpx;
					font-weight: bold;
					color: $main-unit-color;
				}
			}
		}
	}
	padding: 20rpx;
	height: 100vh;
	background-color: $uni-bg-color-grey;

	&-container {
		padding-bottom: 80rpx;
	}
	&-item {
		background-color: white;
		margin-top: 20rpx;
		border-radius: 20rpx;
		&-header {
			font-weight: bold;
		}
		&-list {
		}
		&-product {
			&-right {
				width: -webkit-fill-available;
				image {
					width: 100%;
					height: 100%;
				}
				.scale {
					.dqbl {
						color: $uni-text-color-grey;
					}
					.blsz {
						color: $main-color;
					}
				}
				.text {
					height: 50rpx;
				}
				.price {
					font-weight: bold;
					.unit {
						color: $main-unit-color;
					}
					.number {
						color: $main-unit-color;
						font-size: 30rpx;
					}
				}
			}
		}
	}
}
</style>
