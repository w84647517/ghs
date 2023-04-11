<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30">
			<view class="u-m-r-10"><u-avatar :src="pic" size="140"></u-avatar></view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{ user.username }}</view>
				<view class="u-font-14 u-tips-color">账户:{{ user.mobile }}</view>
			</view>
			<!-- <view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view> -->
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="list" title="我的清单" @tap="toInventory"></u-cell-item>
				<u-cell-item icon="order" title="计算器" @tap="toCounter"></u-cell-item>
				<u-cell-item icon="star" title="商品推荐" :arrow="false"><u-switch slot="right-icon" @change="onTjChange" v-model="isTj"></u-switch></u-cell-item>
			</u-cell-group>
			<view v-if="user" class="u-m-t-50" style="width: 90%; margin:0 auto;"><u-button @click="logout">退出登录</u-button></view>
		</view>

		<!-- 	<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="coupon" title="卡券"></u-cell-item>
				<u-cell-item icon="heart" title="关注"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
			</u-cell-group>
		</view> -->
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			pic: require('../../static/avatar.png'),
			isTj: true,
			user: {}
		};
	},
	onLoad() {
		
		this.user = uni.getStorageSync('user');
		if(!this.user){
			uni.showToast({
				icon:'error',
				title:'请登录后再操作！',
				success: () => {
					setTimeout(() => {
						uni.reLaunch({
							url: '../login/login',
							fail: e => {
								console.log(e);
							}
						});
					}, 1500);
				}
			})
		}
		this.isTj = uni.getStorageSync('isTj');
	},
	methods: {
		...mapMutations(['setTjFlag','clearCart']),
		onTjChange(val) {
			this.isTj = val;
			uni.setStorageSync('isTj', this.isTj);
			this.setTjFlag(this.isTj);
		},
		logout() {
			uni.clearStorageSync('token');
			this.clearCart()
			uni.showToast({
				icon: 'none',
				title: '退出成功,即将跳转登录',
				success: () => {
					setTimeout(() => {
						uni.reLaunch({
							url: '../login/login',
							fail: e => {
								console.log(e);
							}
						});
					}, 1500);
				}
			});
		},
		toCounter(){
	
			uni.setClipboardData({
				data:'https://m.homedo.com/counter'
			})
		},
		toInventory() {
			uni.navigateTo({
				url: '../inventory/inventory'
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ededed;
}

.camera {
	width: 54px;
	height: 44px;

	&:active {
		background-color: #ededed;
	}
}
.user-box {
	background-color: #fff;
}
</style>
