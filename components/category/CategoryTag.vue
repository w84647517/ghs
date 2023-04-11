<template>

		<scroll-view scroll-x="true" class="tag" enable-flex>
			<view>
				<u-button
					shape="circle"
					v-for="(tag, index) in tagList"
					:key="tag.id"
					throttle-time="0"
					class="tag"
					@click.stop="tagHandle(index)"
					size="mini"
					:custom-style="twoType == tag.id ? selectStyle : unselectStyle"
				>
				<text v-if="tag.mandatory==0" style="color:red">* </text>{{ tag.name }}
				</u-button>
			</view>
		</scroll-view>
	
</template>

<script>
export default {
	name: 'CategoryTag',
	props: {
		twoType:{
			type:[String,Number,null],
			default:null
		},
		tagList: {
			type: Array,
			default: () => [
				{
					name: '全部',
					id: ''
				}
			]
		}
	},
	data() {
		return {
			tagType:null,
			currentSelect: 0,
			selectStyle: {
				margin: '5px',
				padding: ' 2px 8px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				color: '#5190FF'
			},
			unselectStyle: {
				margin: '5px',
				padding: ' 2px 8px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				color: '#808080'
			}
		};
	},
	methods: {
		tagHandle(index) {
			this.currentSelect = index;
			this.$emit('tag-click',this.tagList[this.currentSelect])
		}
	}
};
</script>

<style lang="scss" scoped>
.tag {
	white-space: nowrap;
	width: 526rpx;
	overflow: hidden;
	padding-right: 10rpx;
	&-item {
	}
}
</style>
