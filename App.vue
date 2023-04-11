<script>
	// 只能在App.vue里监听应用的生命周期
	export default {
		
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
