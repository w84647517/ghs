<template>
	<view class="bg-gray u-p-b-60">
		<view class="status_bar"><!-- 这里是状态栏 --></view>
		<view class="header-container" :style="{ 'padding-top': btnTop + 'px' }"><image src="../../static/name.png" mode="heightFix" /></view>
		<view class="top-container">
			<view class="top-cricle"></view>
			<view>
				<swiper
					class="swiper-container"
					indicator-color="#ffffff"
					:circular="true"
					indicator-active-color="#5190FF"
					:indicator-dots="true"
					:autoplay="true"
					:interval="3000"
					:duration="1000"
				>
					<swiper-item v-for="banner in bannerList" :key="banner.id"><image mode="scaleToFill" class="swiper-item" :src="banner.img" /></swiper-item>
				</swiper>
			</view>
		</view>
		<view style="height:160rpx;"></view>
		<view class="u-p-20">
			<view class="menu-list">
				<u-grid :col="4" :border="false">
					<u-grid-item @tap="toList(item,1)" class="menu-item" v-for="(item, index) in menuList" :key="index">
						<image class="menu-image" :src="item.img" mode="aspectFit"></image>
						<view class="menu-text">{{ item.name }}</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>

		<view class="u-p-l-20 u-p-r-20">
			<view class="four-list">
				<view class="u-p-25 u-font-bold">资讯推荐</view>
				<u-grid :col="2" :border="false">
					<u-grid-item @tap="toList(item,2)" class="menu-item" v-for="(item, index) in modularList" :key="index">
						<image class="menu-image" :src="item.img" mode="aspectFit"></image>
						<view class="menu-text">{{ item.name }}</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
	</view>
</template>

<script>
import { getBanner, getContentCategory, getModular } from '@/api/index';
import { mapActions } from 'vuex';
export default {
	data() {
		return {
			modularList: [],
			bannerList: [],
			btnTop: 40,
			menuList: [
				{
					name: '解决方案',
					icon: require('../../static/rw.png'),
					path: ''
				},
				{
					name: '方案说明',
					icon: require('../../static/rw.png'),
					path: ''
				},
				{
					name: '学习资料',
					icon: require('../../static/rw.png'),
					path: ''
				},
				{
					name: '学习资料',
					icon: require('../../static/rw.png'),
					path: ''
				},
				{
					name: '公司文件',
					icon: require('../../static/rw.png'),
					path: ''
				},
				{
					name: '检测报告',
					icon: require('../../static/rw.png'),
					path: ''
				},
				{
					name: '国家规范',
					icon: require('../../static/rw.png'),
					path: ''
				},
				{
					name: '文件下载',
					icon: require('../../static/rw.png'),
					path: ''
				}
			]
		};
	},
	methods: {
		toList(item, type) {
			uni.navigateTo({
				url: `../list/list?id=${item.id}&types=${item.types}&name=${item.name}&pageType=${type}`
			});
		}
	},
	mounted() {
		// #ifdef MP-WEIXIN
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		console.log(menuButtonInfo);
		this.btnTop = menuButtonInfo.top - 17;
		// #endif
	},
	async onLoad() {
		const result = await getBanner();
		this.bannerList = result.bannerEntityList;
		const result2 = await getContentCategory();
		this.menuList = result2.contentsClassificationEntityList;
		const result3 = await getModular();
		this.modularList = result3.modularClassificationEntityList;
	}
};
</script>

<style scoped lang="scss">
.index-container {
}
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
	background-color: $main-color;
}
.header-container {
	background-color: $main-color;
	// background-color: #fff;
	display: flex;
	align-items: center;
	padding-left: 30rpx;
	image {
		height: 45rpx;
	}
}
.top-container {
	background-color: $main-color;
	height: 180rpx;
	position: relative;
	.swiper-container {
		padding: 20rpx;
		height: 300rpx;

		.swiper-item {
			border-radius: 10rpx;
			overflow: hidden;
			height: 100%;
			width: 100%;
		}
	}
	.top-cricle {
		height: 240rpx;
		width: 100%;
		border-bottom-left-radius: 100%;
		border-bottom-right-radius: 100%;
		background-color: $main-color;
		position: absolute;
		bottom: -120rpx;
	}
}
.menu-list,
.four-list {
	margin-bottom: 20rpx;
	background: #fff;

	border-radius: 20rpx;
	overflow: hidden;

	.menu-item {
		::v-deep.u-grid-item-box {
			padding: 10px !important;
		}
		.menu-image {
			width: 100%;
			height: 80rpx;
		}
		.menu-text {
			margin-top: 20rpx;
		}
	}
}
</style>
