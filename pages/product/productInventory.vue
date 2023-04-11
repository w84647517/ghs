<template>
	<view v-if="allList.length">
		<view class="inventory">
			<view class="u-p-t-20 u-p-b-20">
				<u-input placeholder="请输入工程名字" v-model="systemName" type="text" border ></u-input>
			</view>
			<u-table padding="40">
				<u-tr>
					<u-td>产品分类</u-td>
					<u-td>产品名称</u-td>
					<u-td>数量</u-td>
					<u-td>价格</u-td>
				</u-tr>
				<u-tr v-for="item in allList" :key="item.id">
					<u-th>{{ item.classificationIdOneName }}</u-th>
					<u-th>{{ item.name }}</u-th>
					<u-th>{{ item.count }}</u-th>
					<u-th>{{ ((Number(item.unitPrice * (item.scale / 100)) + Number(item.unitPrice)) * Number(item.count)).toFixed(2) }}</u-th>
				</u-tr>
			</u-table>
			<view class="u-flex  u-m-t-20" :class="isSave ? 'u-row-right' : 'u-row-between'">
				<view class="edit-back" v-if="!isSave" @tap="toBack">返回编辑</view>
				<view>
					<text>总计:</text>
					<text class="price u-font-md">{{ allPrice }}</text>
				</view>
			</view>
			
		</view>

		<view class="u-flex u-row-between bottom ">
			<view class="u-flex-6 left" @tap="saveInventory" v-if="!isSave">保存清单</view>
			<view class="u-flex-6 right" @tap="exportInven">导出清单</view>
		</view>
		<uni-popup ref="dialog" type="dialog">
			<uni-popup-dialog
				ref="inputClose"
				:before-close="true"
				mode="input"
				title="保存清单"
				placeholder="请输入要保存的名称"
				@confirm="dialogInputConfirm"
				@close="dialogInputClose"
			></uni-popup-dialog>
		</uni-popup>
		<u-action-sheet :list="actionList" @click="actionClick" v-model="actionShow"></u-action-sheet>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { saveInventory, exportInventory } from '@/api';
export default {
	data() {
		return {
			systemName:'',
			selfProducts:[],
			actionList: [
				{
					text: '简单导出'
				},
				{
					text: '分类导出'
				}
			],
			actionShow: false,
			//是否已经保存了清单
			isSave: false,
			allList: []
		};
	},
	onLoad() {
		this.selfProducts=JSON.parse(JSON.stringify(this.allProducts))
		this.allList = this.allList.concat(this.selfProducts);
		this.allListSelect=JSON.parse(JSON.stringify(this.allSelected))
	},
	computed: {
		...mapGetters(['getCartList', 'getProductList']),
		allProducts() {
			let products = [];
			this.getCartList.map(item => {
				item.products.map(pro => {
					if (pro.selected) {
						products.push(pro);
					}
				});
			});
			return products;
		},
		allSelected() {
			const cartList = JSON.parse(JSON.stringify(this.getCartList));
			return cartList.map(item => {
				item.products = item.products.filter(pro => pro.selected);
				return item;
			});
		},
		allPrice() {
			let price = 0;
			this.allList.map(product => {
				price += (Number(product.unitPrice * (product.scale / 100)) + Number(product.unitPrice)) * Number(product.count);
			});
			return price.toFixed(2);
		}
	},
	methods: {
		...mapMutations(['clearCart']),
		async actionClick(index) {
			const data = this.allListSelect.map(item => {
				item.classificationEntityList = item.classificationEntityList.filter(a => a.id);
				return item;
			});
			//简单导出
			let result = await exportInventory( {classificationEntityList:data,system:this.systemName,type:index == 0 ? 1 : 2});
			if(result.code==500){
				uni.showToast({
					title:result.msg,
					icon:'none',
					duration:5000
				})
				return
			}
			uni.setClipboardData({
				data: result.url,
				showToast: false,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板请在浏览器中打开',
						icon: 'none'
					});
				}
			});
		},
		exportInven() {
			if(this.systemName.trim()==''){
				uni.showToast({
					icon: 'none',
					title: '请输入工程名'
				});
			}else{
				this.actionShow = true;
			}
			
		},
		async dialogInputConfirm(val) {
			if (!val.trim()) {
				uni.showToast({
					icon: 'none',
					title: '请输入清单名称'
				});
				return;
			} else {
				let result = await saveInventory({
					name: val,
					contents: JSON.stringify(this.allListSelect),
					totalPrice:this.allPrice
				});
				this.$refs.dialog.close();
				if (result.code == 0) {
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					this.clearCart()
					this.isSave = true;
				} else {
					uni.showToast({
						title: '保存失败',
						icon: 'error'
					});
				}
			}
		},
		dialogInputClose() {
			this.$refs.dialog.close();
		},
		saveInventory() {
			this.$refs.dialog.open();
		},
		toBack() {
			uni.switchTab({
				url: '../cart/cart'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.inventory {
	/deep/.u-th {
		height: 100%;
	}

	padding: 20rpx;
	margin-bottom:100rpx;
	margin-top: 30rpx;
	.edit-back {
		color: $main-color;
	}
	.price {
		color: $main-unit-color;

		font-weight: bold;
	}
}
.bottom {
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	line-height: 80rpx;
	height: 80rpx;
	text-align: center;
	color: white;
	.left {
		height: 100%;
		background-color: black;
	}
	.right {
		height: 100%;
		background-color: $main-color;
	}
}
</style>
