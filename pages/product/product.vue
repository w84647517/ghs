<template>
	<view class="u-wrap">
		<view class="u-search-box" @tap="search(null)">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索全部产品</text>
			</view>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view">
				<view
					v-for="(item, index) in tabbar"
					:key="index"
					class="u-tab-item"
					:class="[current == index ? 'u-tab-item-active' : '']"
					:data-current="index"
					@tap.stop="swichMenu(index, item)"
				>
					<text class="u-line-1 u-font-12">{{ item.name }}</text>
				</view>
			</scroll-view>
			<block>
				<view class="" style="position: relative;">
						<view class="item-title u-p-15" style="z-index: 99999">
							<view class="" @tap="search(tabbar[current]['id'])">
								<view class="u-search-inner">
									<u-icon name="search" color="#909399" :size="28"></u-icon>
									<text class="u-search-text">搜索当前分类产品</text>
								</view>
							</view>
							<view class="u-flex u-row-between">
								<view class="">
									<text>{{ tabbar[current]['name'] }}</text>
								</view>
								<view class="item-filter u-p-t-20 u-p-b-20">
									<text class="u-font-25 u-m-r-40"  :style="{ color: sortType == 0 ? '#5190FF' : '#999' }" @tap="sortClick(0)">品牌</text>
									<text class="u-font-25"  :style="{ color: sortType == 1 ? '#5190FF' : '#999' }" @tap="sortClick(1)">销量</text>
									<text class="u-font-25 u-m-l-40" :style="{ color: sortType == 2 ? '#5190FF' : '#999' }" @tap="sortClick(2)">价格</text>
								</view>
							</view>
							<category-tag :tagList="tabbar[current]['classificationEntityList']" @tag-click="tagClick" :twoType="twoType"></category-tag>
						</view>
				</view>
				
				<scroll-view scroll-y class="right-box" @scrolltolower="loadMore" :lower-threshold="50" :scroll-top="scrollTop">
					<view class="page-view" v-if="tabbar.length">
						<view class="class-item">
							
							
							<view class="item-container">

								<view class="" v-for="(product, index1) in currentProducts" :key="index1">
									<category-item @openModal="openModal" :value.sync="product.count" :productItem="product" :category="tabbar[current]"></category-item>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
		<productRelevance @syncCount="syncCount" ref="tj" />
	</view>
</template>

<script>
import { getCategory, getProductById } from '@/api/index';
import { mapActions, mapGetters,mapMutations } from 'vuex';
import categoryTag from '../../components/category/CategoryTag';
import categoryItem from '../../components/category/CategoryItem';
import productRelevance from '@/components/productRelevance/productRelevance.vue';
export default {
	data() {
		return {
			sortType: '', //1销量   2价格 默认不选中排序
			twoType: null,
			tabbar: [],
			currentProducts: [], //当前选择分类的产品
			scrollTop: 0, //tab标题的滚动条位置
			current: 0, // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			pageConfig: {
				currPage: 0,
				totalPage: 1
			}
		};
	},
	computed: {
		...mapGetters(['getProductList', 'getCartList'])
	},
	onShow() {
		console.log('show');
		this.syncCount();
	},
	onLaunch() {
		
	},
	async onLoad() {
		this.setTjFlag(uni.getStorageSync('isTj'))
		let { classificationEntityList } = await getCategory();

		this.setCategory(classificationEntityList);
		this.tabbar = this.getProductList;
		//默认请求第一个分类
		if (this.tabbar.length) {
			this.getProduct({
				classificationIdOne: this.tabbar[0]['id'],
				classificationIdTwo: this.twoType
			});
		}
	},
	methods: {
		...mapActions(['setCategory']),
		...mapMutations(['setTjFlag']),
		openModal(item) {
			this.$refs.tj.open(item.id)
		},
		search(pid) {
			uni.navigateTo({
				url: `../searchProduct/searchProduct?classificationIdOne=${pid?pid:''}&classificationIdTwo=${this.twoType?this.twoType:''}`
			});
		},
		tagClick(value) {
			this.scrollTop=0
			this.twoType = value.id;
			this.currentProducts = [];
			this.getProduct({
				classificationIdOne: this.tabbar[this.current]['id'],
				classificationIdTwo: this.twoType
			});
		},
		sortClick(type) {
			if (this.sortType == type) {
				this.sortType = '';
			} else {
				this.sortType = type;
			}

			this.currentProducts = [];
			//   salesNumbers按照销量排序（随意传值即可）
			//   unitPrice按照价格排序（随意传值即可）

			let params = {
				classificationIdOne: this.tabbar[this.current]['id'],
				classificationIdTwo: this.twoType
			};
			this.getProduct(params);
		},
		//加载更多
		loadMore() {
			console.log('触底加载');
			let { currPage, totalPage } = this.pageConfig;
			if (currPage < totalPage) {
				currPage++;
				this.getProduct({
					classificationIdOne: this.tabbar[this.current]['id'],
					classificationIdTwo: this.twoType,
					page: currPage
				});
			}
		},
		//同步购物车中的数量
		async syncCount() {
			let allProduct = [];
			this.getCartList.forEach(item => {
				item.products.forEach(product => {
					allProduct.push(product);
				});
			});

			this.currentProducts.forEach(item => {
				item.count = 0;
			});

			allProduct.map(product => {
				console.log(product, 'product');
				this.currentProducts.forEach(item => {
					// console.log(item, product, ' 产品');
					if (item.id == product.id) {
						item.count = product.count;
						// this.$set(item,'count',product.count)
					}
				});
			});
		},
		// 点击左边的栏目切换
		async swichMenu(index, item) {
			if (index == this.current) return;
			this.current = index;
			this.currentProducts = [];
			this.twoType = null;
			this.sortType = '';
			this.getProduct({
				classificationIdOne: item.id,
				classificationIdTwo: this.twoType
			});

			// 如果为0，意味着尚未初始化
			// if (this.menuHeight == 0 || this.menuItemHeight == 0) {
			// 	await this.getElRect('menu-scroll-view', 'menuHeight');
			// 	await this.getElRect('u-tab-item', 'menuItemHeight');
			// }
			// 将菜单菜单活动item垂直居中
			this.scrollTop = 0;
		},
		async getProduct(params) {
			if(this.sortType==0){
				params.brand='0'
			}
			if (this.sortType == 1) {
				params.salesNumbers = '1';
			}
			if (this.sortType == 2) {
				params.unitPrice = '2';
			}
			/**
			 * 查询条件page页数
			 * classificationIdOne一级分类id,
			 * classificationIdTwo二级分类id,
			 * salesNumbers按照销量排序（随意传值即可），
			 * unitPrice按照价格排序（随意传值即可）,
			 * name名称搜索
			 */
			let { page } = await getProductById(params);
			this.currentProducts.push(...page.list);
			this.pageConfig = {
				currPage: page.currPage,
				pageCount: page.pageCount,
				totalPage: page.totalPage
			};
			this.syncCount();
		},
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.' + elClass)
					.fields({ size: true }, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					})
					.exec();
			});
		}
	},
	components: {
		productRelevance,
		'category-tag': categoryTag,
		'category-item': categoryItem
	}
};
</script>

<style lang="scss" scoped>
.u-wrap {
	height: calc(100vh);
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
}

.u-search-box {
	padding: 18rpx 30rpx;
}

.u-menu-wrap {
	flex: 1;
	z-index: 999;
	display: flex;
	overflow: hidden;
}

.u-search-inner {
	background-color: rgb(234, 234, 234);
	border-radius: 100rpx;
	display: flex;
	align-items: center;
	padding: 10rpx 16rpx;
}

.u-search-text {
	font-size: 26rpx;
	color: $u-tips-color;
	margin-left: 10rpx;
}

.u-tab-view {
	width: 200rpx;
	overflow: hidden;
	height: 100%;
}

.u-tab-item {
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.u-tab-item-active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fff;
}

.u-tab-item-active::before {
	content: '';
	position: absolute;
	border-left: 2px solid $u-type-primary;
	height: 110rpx;
	left: 0;
	top: 0rpx;
}

.u-tab-view {
	height: 100%;
}

.right-box {
	background-color: rgb(250, 250, 250);
}

.page-view {
	padding: 16rpx;
}

.class-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	border-radius: 8rpx;
}

.item-title {
	background-color: #fff;
	position: absolute;
	left: 0;
	top:0;
	font-size: 26rpx;
	padding:20rpx;
	color: $u-main-color;
	font-weight: bold;
	.item-filter {
		font-weight: normal;
		font-size: 22rpx;
		color: $uni-text-color-grey;
	}
}

.item-menu-name {
	font-weight: normal;
	font-size: 24rpx;
	color: $u-main-color;
}

.item-container {
	padding-top:220rpx;
	display: flex;
	flex-wrap: wrap;
}

.thumb-box {
	width: 33.333333%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 20rpx;
}

.item-menu-image {
	width: 120rpx;
	height: 120rpx;
}
</style>
