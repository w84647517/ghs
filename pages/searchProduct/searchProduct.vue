<template>
	<view>
		<view class="search u-p-20">
			<u-search :focus="true" placeholder="请输入产品名称" v-model="keyWord" :clearabled="true" :show-action="true" action-text="搜索" @search="search" @custom="search"></u-search>
		</view>
		<view v-if="productList.length">
			<scroll-view style="height:calc(100vh - 127rpx)" scroll-y @scrolltolower="loadMore" :lower-threshold="50" :scroll-top="scrollTop">
				<view class="u-border-bottom" v-for="product in productList" :key="product.id">
					<categoryItemSearch :value.sync="product.count" :productItem="product" :category="getProductList.find(a => a.id == product.classificationIdOne)"></categoryItemSearch>
				</view>
			</scroll-view>
		</view>
		<view v-else style="height:calc(100vh - 127rpx)">
				<u-empty text="无数据" mode="list"></u-empty>
		</view>
	</view>
</template>

<script>
import categoryItemSearch from '@/components/category/CategoryItemSearch';
import { getProductById } from '@/api';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			classificationIdOne:null,
			classificationIdTwo:null,
			scrollTop: 0,
			keyWord: '',
			productList: [],
			pageConfig: {
				currPage: 0,
				totalPage: 1
			}
		};
	},
	onShow() {
		this.syncCount()
	},
	onLoad(options) {
		console.log(options)
		this.classificationIdOne=options.classificationIdOne
		this.classificationIdTwo=options.classificationIdTwo
	},
	methods: {
		loadMore() {
			let { currPage, totalPage } = this.pageConfig;
			if (currPage < totalPage) {
				currPage++;
				this.getList(currPage)
			}
		},
		 search() {
			 this.productList=[]
			this.getList(1)
		},
		async getList(page){
			let result = await getProductById({ name: this.keyWord,classificationIdOne:this.classificationIdOne,classificationIdTwo:this.classificationIdTwo,page });
			this.productList.push(...result.page.list);
			this.pageConfig = {
				currPage: result.page.currPage,
				pageCount: result.page.pageCount,
				totalPage: result.page.totalPage
			};
			this.syncCount();
		},
		//同步购物车中的数量
		async syncCount() {
			let allProduct = [];
			this.getCartList.forEach(item => {
				item.products.forEach(product => {
					allProduct.push(product);
				});
			});

			this.productList.forEach(item => {
				item.count = 0;
			});

			allProduct.map(product => {
				console.log(product, 'product');
				this.productList.forEach(item => {
					// console.log(item, product, ' 产品');
					if (item.id == product.id) {
						item.count = product.count;
						// this.$set(item,'count',product.count)
					}
				});
			});
		}
	},
	computed: {
		...mapGetters(['getProductList', 'getCartList'])
	},
	components: {
		categoryItemSearch
	}
};
</script>

<style></style>
