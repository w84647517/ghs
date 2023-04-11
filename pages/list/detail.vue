<template>
	<view  >
		<view class="u-p-20" v-if="contents.types==3">
			<view class="content-title">
				{{contents.name}}
			</view>
			<view class="content-time u-p-t-20">
				{{contents.releaseTime}}
			</view>
			<view class="u-p-t-20">
				<u-parse :html="contents.contents"></u-parse>
			</view>
		</view>
		<view v-if="contents.types==2">
			<video :src="contents.contents" controls autoplay style="width: 100%;"></video>
			<view class="u-p-20 u-border-bottom u-font-bold">
				简介
			</view>
			<view class="u-p-20 u-font-sm u-font-color-grey">
				{{contents.descs}}
			</view>
		</view>
	</view>
</template>

<script>
	import {getContentById,getModularById} from '@/api'
	export default {
		data() {
			return {
				contents:{}
			}
		},
		methods: {
			
		},
		async onLoad(options) {
		let {contents,modular} = 	options.pageType==1? await getContentById(options.id): await getModularById(options.id)
		console.log(contents,'result',modular)
		this.contents=options.pageType==1?contents:modular
		uni.setNavigationBarTitle({
			title: this.contents.name
		});
		this.contents.types=options.types
		}
	}
</script>

<style lang="scss" scoped>
.content-title{
	font-size:40rpx;
	font-weight: bold;
}
.content-time{
	text-align: right;
	color:$uni-text-color-grey;
	font-size:24rpx;
}
</style>
