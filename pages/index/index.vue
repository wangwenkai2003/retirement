<template>
	<view class="content">
		<image class="logo" src="/static/rlogo.svg" @click="gotoMy">
			我的
		</image>
		<view class="text-area">
			<view class="main-item">
				<image class="main-item-img" src="/static/food.svg"  @click="gotoFood"></image>
				<view>食品</view>
			</view>
			<view class="main-item">
				<image class="main-item-img" src="/static/medical.svg" @click="gotoMedical"></image>
				<view >医疗</view>
			</view>
			<view class="main-item">
				<image class="main-item-img" src="/static/entertainment.svg" @click="gotoTravel"></image>
				<view >娱乐</view>
			</view>

			<view class="main-item">
				<image class="main-item-img" src="/static/other.svg" @click="gotoStay"></image>
				<view >其他</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {logout} from '../../api/user.js'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// logout()
		},
		methods: {
			gotoFood(){
				uni.navigateTo({
					url:"/pages/food/food"
				})
			},
			gotoTravel(){
				uni.navigateTo({
					url:"/pages/travel/travel"
				})
			},
			gotoStay(){
				uni.navigateTo({
					url:"/pages/stay/stay"
				})
			},
			gotoMedical(){
				uni.navigateTo({
					url:"/pages/medical/medical"
				})
			},
			gotoMy(){
				uni.navigateTo({
					url:"/pages/my/my"
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 100rpx;
		width: 100rpx;
		margin-top: 20rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		flex-wrap: wrap;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.main-item{
		width: 45%;
		margin:10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.main-item-img{
		height: 150rpx;
		width: 150rpx;
	}
</style>
