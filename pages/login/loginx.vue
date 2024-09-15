<template>
	<view>
	
	</view>
</template>

<script>
	import {getOpenId} from '../../api/user.js'
	export default {
		data() {
			return {
				userInfo:{}
			}
		},
		onShow() {
			if(uni.getStorageSync('token')){
				 uni.redirectTo({
				        url: '/pages/index/index' // 请替换为实际的首页路径
				      });
			}
			uni.removeStorageSync('token');
			this.getUserInfo()
		},
		mounted() {
			// 
		},
		methods: {
			getUserInfo() {
				var that = this;
				uni.showModal({
					mask:true,
					title:'温馨提示',
					content:'使用微信一键授权登录',
					success(res) {
						if(res.confirm){
							uni.getUserProfile({
							    //声明获取用户个人信息后的用途(必填)
								desc: "获取你的昵称，头像",
								success: (res) => {
							        //调用Vuex中的updateUserInfo()方法，将用户信息存储到Vuex中
									// this.updateUserInfo(res.userInfo)
									// console.log(res.userInfo);
									try {
									uni.setStorageSync('user',res.userInfo)
									}catch (e) {
										console.log(e);
									}
									// this.userInfo =res.userInfo
									if(res.userInfo){
										that.nickName = res.userInfo.nickName;
										 uni.login({
										 	 provider:"weixin"
										 }).then(
										 (res) =>{
											 getOpenId(res.code).then(sres=>{
												 console.log(sres,'resss');
												 if(sres){
													 uni.setStorageSync('token',sres)
													 uni.redirectTo({
													 	url:"/pages/index/index"
													 })
													const token = uni.getStorageSync('token')
													console.log(token,'token');
												 }
											 })
											 // console.log(res.code);
										 }
										 ) 
									}
								},
								fail: () => {
									uni.$showMsg('您取消了登录授权！')
								}
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style>

</style>
