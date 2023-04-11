<template>
	<view style="padding-bottom:100rpx;position: relative;">
		<view class="product-swiper"><u-swiper mode="number" height="500" :list="swiperList"></u-swiper></view>
		<view class="product">
			<view class="product-price">
				<text class="unit">￥</text>
				<text class="price">{{ productInfo.unitPrice }}</text>
			</view>
			<view class="product-title u-line-2">
				<text class="jcbg u-m-r-15 u-font-sm " v-if="productInfo.testReport">检测报告</text>
				<text class="u-font-lg u-title" user-select>{{ productInfo.name }}</text>
			</view>
			<view class="product-desc" user-select>{{ productInfo.keywords }}</view>
			<view class="product-tab"><u-tabs :list="tabList" :is-scroll="false" :current="currentTab" @change="tabChange"></u-tabs></view>
			<view class="u-p-20">
				<view v-if="currentTab == 1">
					<!-- 供应商信息 -->
					<u-cell-group v-if="productInfo.supplier">
						<u-cell-item :title="p.split('p')[0]" v-for="(p, index) in productInfo.supplier.split('|')" :arrow="false" :key="index">
							<view slot="right-icon" @tap="phoneClick(p)">
								<u-icon name="phone" class="u-p-r-15"></u-icon>
								{{ p.split('p')[1] ? p.split('p')[1] : '暂无联系人信息' }}
							</view>
						</u-cell-item>
					</u-cell-group>
				</view>
				<view v-if="currentTab == 0">
					<!-- 详细参数 -->
					<u-parse :html="productInfo.parameter"></u-parse>
				</view>
				<view v-if="currentTab == 2">
					<!-- 详细参数 -->
					<u-input :value="productInfo.testReport" :disabled="true" border class="u-p-20" placeholder="" />
					<u-button type="primary" class="u-p-20" @click="copyLink">复制检测报告</u-button>
					
				</view>
			</view>
		</view>
		<view class="product-bottom safe-area-inset-bottom u-border-top">
			<view class="u-flex u-row-between" style="height:100%">
				<view class="left" @tap="toCart">
					<u-icon size="large" name="shopping-cart"></u-icon>
					<br />
					<text class="u-font-sm">购物车</text>
				</view>
				<view class="right">
					<u-button shape="circle" :custom-style="customStyle" :ripple="false" size="mini" @click="countChange(1)" v-if="productInfo.count == 0">加入购物车</u-button>
					<uni-number-box v-show="productInfo.count > 0" v-model="productInfo.count" @change="countChange" @blur="countBlur"></uni-number-box>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getProductInfo } from '@/api';
import { mapMutations, mapGetters } from 'vuex';
export default {
	data() {
		return {
			currentTab: 0,
			customStyle: {
				// 注意驼峰命名，并且值必须用引号包括，因为这是对象
				color: 'white',
				borderRadius: '40rpx',
				padding: '5rpx 20rpx',
				backgroundColor: '#5190FF'
			},

			productInfo: {},
			swiperList: [],
			tabList: []
		};
	},
	computed: {
		...mapGetters(['getProductList'])
	},
	methods: {
		...mapMutations(['updateCart']),
		copyLink(){
			uni.setClipboardData({
				data:this.productInfo.testReport
			})
		},
		phoneClick(phone) {
			const pNumber = phone.split('p')[1];
			uni.makePhoneCall({
				phoneNumber: pNumber //仅为示例
			});
		},
		toCart() {
			uni.switchTab({
				url: '../cart/cart'
			});
		},
		tabChange(val) {
			this.currentTab = val;
		},
		countChange(val) {
			console.log(val, 'ssss');
			//更改数量
			this.productInfo.count = val;
			this.updateCart({
				category: this.getProductList.find(item => item.id == this.productInfo.classificationIdOne),
				product: this.productInfo,
				count: val
			});
		},
		countBlur(e) {
			const val = e.target.value;
			console.log(val, 'valll');
			if (val == '') {
				this.$nextTick(() => {
					this.updateCart({
						category: this.getProductList.find(item => item.id == this.productInfo.classificationIdOne),
						product: this.productInfo,
						count: 0
					});
				});
			}
		}
	},
	async onLoad(options) {
		let { products } = await getProductInfo(options.id);
		this.productInfo = products;
		this.productInfo.count = options.count;
		this.swiperList = this.productInfo.imgs.split(',').map(item => {
			return {
				image: item
			};
		});
		uni.setNavigationBarTitle({
			title: this.productInfo.name
		});
		this.tabList =['',null].includes(this.productInfo.testReport) 
			? [
					{
						name: '详细参数'
					},
					{
						name: '供应商信息'
					}
			  ]
			: [
					{
						name: '详细参数'
					},
					{
						name: '供应商信息'
					},

					{
						name: '检测报告'
					}
			  ];
	}
};
</script>

<style lang="scss" scoped>
.product-swiper {
	width: 100%;
}
.product {
	padding: 10rpx 20rpx;
	.product-price {
		font-weight: bold;
		.unit {
			color: $main-unit-color;
		}
		.price {
			color: $main-unit-color;
			font-size: 50rpx;
		}
	}
	.product-title {
		.jcbg {
			padding: 5rpx 10rpx;
			border-radius: 10rpx;
			background-color: $main-color;
			color: white;
		}
	}
	.product-desc {
		color: $uni-text-color-grey;
		margin-top: 10rpx;
		font-size: 24rpx;
	}
	.product-tab {
		margin-top: 30rpx;
	}
}
.product-bottom {
	background-color: #fff;
	z-index: 999;
	position: fixed;
	bottom: 0;
	left: 0;
	height: 90rpx;
	padding: 0 20rpx;
	width: 100%;
	.left {
		text-align: center;
	}
	.right {
	}
}
</style>
