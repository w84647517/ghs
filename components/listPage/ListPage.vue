<template>
	<view>
		<!-- 1文件 -->
		<view v-if="types == 1">
			<view class="" v-for="item in listArr" :key="item.id">
				<view class="u-flex u-row-between content-list u-border-bottom u-p-b-20">
					<view class="u-line-1" style="width: 50%;">
						{{ item.name }}
						<view class="u-p-t-18">
							<view class="time u-font-sm u-font-color-grey">上传时间:{{ item.releaseTime }}</view>
						</view>
					</view>
					<view class="">{{ item.contents.split('.')[item.contents.split('.').length - 1] }}</view>
					<view class="downbtn" @tap="downloadFile(item)">下载</view>
				</view>
			</view>
		</view>
		<!-- 2视频 -->
		<view v-if="types == 2 || types == 3">
			<view class="" v-for="item in listArr" :key="item.id">
				<view class="content-list u-border-bottom" @tap="toDetail(item)">
					<view class="title">
						<view class="u-line-1 u-p-b-15">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<view class="u-flex item u-col-top">
						<view class="u-flex-3"><image :src="item.coverImg !== '1' ? item.coverImg : '../../static/w.webp'" class="image" mode="aspectFill"></image></view>
						<view class="u-flex-9">
							<view class="desc">{{ item.keywords }}</view>
							<view class="time">{{ item.releaseTime }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 3文章 -->
	</view>
</template>

<script>
export default {
	props: {
		types: {
			type: [String, Number],
			default: 1
		},
		listArr: {
			type: Array,
			default: () => []
		},
		pageType: {
			type: [String, Number],
			default: 1
		}
	},
	name: 'list',
	data() {
		return {
			src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
			title: '素胚勾勒出青花，笔锋浓转淡',
			subTitle: '2020-05-15',
			thumb: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg'
		};
	},
	methods: {
		downloadFile(item) {
			uni.setClipboardData({
				data: item.contents,
				showToast: false,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板请在浏览器中打开',
						icon: 'none'
					});
				}
			});
		},
		toDetail(item) {
			uni.navigateTo({
				url: `../../pages/list/detail?id=${item.id}&types=${this.types}&pageType=${this.pageType}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content-list {
	padding: 20rpx;
	.item {
		.image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 10rpx;
		}
		.desc {
			color: $uni-text-color-grey;
			height: 170rpx;
			margin-left: 20rpx;
		}
		.time {
			margin-left: 20rpx;
			color: $uni-text-color-grey;
		}
	}
	.downbtn {
		color: $main-color;
	}
}
</style>
