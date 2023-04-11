<template>
	<view>
		<view class="">
			<view class="search u-p-20">
				<u-search placeholder="请输入清单名称" v-model="keyWord" :clearabled="true" :show-action="true" action-text="搜索" @custom="search"></u-search>
			</view>
			<view class="filter">
				<zero-filter-bar
					style="width: 100%;"
					ref="zeroFilterBar"
					:dataList="[
						{
							id: 1,
							name: '时间',
							sort: true
						},
						{
							id: 2,
							name: '价格',
							sort: true
						}
					]"
					:extraBtn="false"
					@filter="handleFilterItem"
				></zero-filter-bar>
			</view>
		</view>
		<view class="bg-gray" v-if="inventortList.length">
			<scroll-view style="height:calc(100vh - 187rpx)" scroll-y @scrolltolower="loadMore" :lower-threshold="50" :scroll-top="scrollTop">
				<u-swipe-action @click="swiperClick" :show="product.show" :index="index" v-for="(item, index) in inventortList" :key="item.id" :options="options">
					<view class="list u-p-20 u-border-top">
						<view class="u-flex item">
							<view class="left"><image src="../../static/rw.png" mode="aspectFill"></image></view>
							<view class="right u-p-l-25">
								<view class="title u-font-35  u-line-1">{{ item.name }}</view>
								<view class="time u-font-sm u-font-color-grey u-p-t-40">{{ item.createTime }}</view>
							</view>
						</view>
					</view>
				</u-swipe-action>
			</scroll-view>
		</view>
		<view style="height:100vh" v-else><u-empty text="没有数据" mode="list"></u-empty></view>
	</view>
</template>

<script>
import { getInventory, getInventoryById, removeInventoryById } from '@/api/index.js';
import { mapMutations } from 'vuex';

export default {
	data() {
		return {
			f: 2,
			inventortList: [],
			scrollTop: 0,
			keyWord: '',
			pageConfig: {
				currPage: 0,
				totalPage: 1
			},
			time: 'timedesc',
			price: 'pricedesc',
			options: [
				{
					text: '编辑',
					style: {
						backgroundColor: '#006dd5'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			options1: [
				{
					label: '时间升序',
					value: 'timeasc'
				},
				{
					label: '时间降序',
					value: 'timedesc'
				}
			],
			options2: [
				{
					label: '金额升序',
					value: 'priceasc'
				},
				{
					label: '金额降序',
					value: 'pricedesc'
				}
			]
		};
	},
	async onLoad() {
		this.fetchList({orderBy:this.f,});
	},
	computed: {
		
	},
	methods: {
		...mapMutations(['setCartList']),
		async fetchList(params) {
			let { page } = await getInventory(params);
			this.inventortList.push(...page.list);
			this.pageConfig = {
				currPage: page.currPage,
				pageCount: page.pageCount,
				totalPage: page.totalPage
			};
		},
		handleFilterItem(index, desc, item) {
			this.inventortList=[]
			if(index==0&&desc){
				this.f=1
			}
			if(index==0&&!desc){
					this.f=2
			}
			if(index==1&&desc){
					this.f=3
			}
			if(index==1&&!desc){
					this.f=4
			}
			this.fetchList({ name: this.keyWord ,orderBy:this.f,page:1});
		},
		search() {
			this.inventortList = [];
			this.fetchList({ name: this.keyWord ,orderBy:this.f});
			this.scrollTop = 0;
		},
		async swiperClick(e, type, index) {
			console.log(e,type, index)
			if (type == 0) {
				const contents = this.inventortList[e]['contents'];
				uni.showLoading({
					title: '加载中，请稍后'
				});
				this.setCartList(JSON.parse(contents));
				setTimeout(() => {
					uni.hideLoading();
					uni.switchTab({
						url: '/pages/cart/cart'
					});
				}, 2000);
			} else {
				let result = await removeInventoryById([this.inventortList[e].id]);
				console.log(result, 'result');
				if (result.code == 0) {
					uni.showToast({
						title: '删除成功',
						icon: 'none',
						success: () => {
							this.inventortList = [];
							this.fetchList({ page: 1,orderBy:this.f,});
						}
					});
				}
			}
		},
		loadMore() {
			let { currPage, totalPage } = this.pageConfig;
			if (currPage < totalPage) {
				currPage++;
				this.fetchList({
					orderBy:this.f,
					page: currPage
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.top {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
}
.list {
	background-color: #fff;
	.item {
	}
	image {
		width: 150rpx;
		height: 150rpx;
	}
}
</style>
