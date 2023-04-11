<template>
	<view class="" >
		<view class="list" v-if="tabList.length">
			<view class="search u-p-10">
				<u-search placeholder="请输入搜素内容" v-model="keyWord" :clearabled="true" :show-action="true" action-text="搜索" @custom="search"></u-search>
			</view>
			<view class="tab"><u-tabs :list="tabList" :is-scroll="true" :current="current" @change="tabChange"></u-tabs></view>
		</view>
		<view class="content" v-if="listArr.length">
			<scroll-view  
			style="height:calc(100vh - 187rpx);margin-top:180rpx" 
			scroll-y @scrolltolower="loadMore"  
			:lower-threshold="50" :scroll-top="scrollTop">
			<listPage :listArr="listArr" :types="types" :pageType="pageType"></listPage>
			</scroll-view>
		</view>
		<view style="height:100vh" v-else>
			<u-empty text="没有数据" mode="list" ></u-empty>
		</view>
	</view>
</template>

<script>
import listPage from '@/components/listPage/ListPage';
import {getContentCategory2,getContentList,getModular2,getModularList} from '@/api'
export default {
	data() {
		return {
			listArr:[],
			types:null,
			pageType:1,
			pageConfig:{
				currPage:0,
				totalPage:0
			},
			keyWord: '',
			scrollTop: 0,
			classificationIdOne:null,
			tabList: [
				{
					name: '待收货'
				},
				{
					name: '待付款'
				},
				{
					name: '待付款'
				},
				{
					name: '待付款'
				},
				{
					name: '待付款'
				},
				{
					name: '待付款'
				},
				{
					name: '待付款'
				},
				{
					name: '待付款'
				},
				{
					name: '待评价'
				}
			],
			current: 0
		};
	},
	methods: {
		search(val) {
			
			this.scrollTop=0
			this.listArr=[]
			this.getList(this.classificationIdOne,this.tabList[this.current]['id']||'',1)
		},
		tabChange(val) {
			this.keyWord=''
			this.current = val;
			this.listArr=[]
			this.getList(this.classificationIdOne,this.tabList[this.current]['id']||'',1)
		},
		loadMore() {
			
			if(this.pageConfig.currPage<this.pageConfig.totalPage){
				this.pageConfig.currPage++
				this.getList(this.classificationIdOne,this.tabList[this.current]['id']||'',this.pageConfig.currPage)
			}
		},
	
		async getList(classificationIdOne,classificationIdTwo,pageNum){
			let {page} = this.pageType==1? await getContentList({
				page:pageNum,
				classificationIdOne,
				classificationIdTwo,
				name:this.keyWord
			}): await getModularList({
				page:pageNum,
				classificationIdOne,
				classificationIdTwo,
				name:this.keyWord
			})
			this.listArr.push(...page.list)
			this.pageConfig={
				currPage:page.currPage,
				totalPage:page.totalPage
			}
		}
	},
	async onLoad(options) {
		this.classificationIdOne=options.id
		this.types=options.types
		this.pageType=options.pageType
		uni.setNavigationBarTitle({
			title: options.name
		});
	let result =  this.pageType==1?await getContentCategory2(options.id): await getModular2(options.id)
	console.log(result,'result,123123')
	this.tabList= result.contentsClassificationEntityList||result.modularClassificationEntityList
	if(this.tabList.length){
		this.getList(options.id,this.tabList[0]['id'],1)
	}
	
	},
	components: {
		listPage
	}
};
</script>

<style lang="scss" scoped>
.list {
	padding: 0 20rpx;
	position: fixed;
	z-index: 99;
	top: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
}
</style>
