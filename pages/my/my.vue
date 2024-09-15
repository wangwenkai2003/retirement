<template>
	<view>
	<view   style="display: flex;align-items: center;padding: 10rpx;">
		<img @click="previewImage" :src="`${imgUrl}/common/download?name=${userInfo.avatar}`" style="width: 150rpx;height: 150rpx;border-radius: 50%;">
		<view style="margin-left: 10rpx;font-size: 18px;font-weight: 700;">{{userInfo.nickName}}</view>
<!-- 		<view v-if="formModel.sex==='0'" style="margin-left: auto;margin-right: 80rpx;"><img src="@/static/man.png" style="width: 70rpx;height: 70rpx;" alt=""></view>
		<view v-if="formModel.sex==='1'" style="margin-left: auto;margin-right: 80rpx;"><img src="@/static/woman.png" style="width: 70rpx;height: 70rpx;" alt=""></view> -->
	</view>
	<view class="" style="margin-top: 5rpx;background-color: #fff;padding: 10rpx;">
		<ul>
			<li @click="openFileSelector" class="base-item" style="display: flex;"><img src="@/static/update.png" style="width: 50rpx;height: 50rpx"><span style="margin-left: 20rpx;">修改头像</span></li>
			<li @click="updateUser" class="base-item" style="display: flex;"><img src="@/static/update.png" style="width: 50rpx;height: 50rpx"><span style="margin-left: 20rpx;">修改昵称</span></li>
			<li @click="exit" class="base-item" style="display: flex;"><img src="@/static/layout.png" style="width: 50rpx;height: 50rpx"><span style="margin-left: 20rpx;">退出登录</span></li>
		</ul>
	</view>
	

		<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="input" title="修改昵称" :value="updateInfo.nickName"
					placeholder="请输入昵称"  @confirm="dialogInputConfirm" ></uni-popup-dialog>
		</uni-popup>

	</view>
</template>

<script>
	import {getImg,uploadUrl} from '../../api/img.js'
	import config from '../../common/config.js'
	import {update} from '../../api/user.js'
	export default {
		data() {
			return {
				userInfo:{},
				updateInfo:{},
				imgUrl:''
			}
		},
		onLoad() {
		this.imgUrl = config.APP_SERVER_URL
		 let userInfo = uni.getStorageSync('user')
		 this.userInfo = userInfo
		 // this.getAvatar(userInfo.avatar)
		},
		methods: {
			previewImage(){
				uni.previewImage({
				    urls: [this.userInfo.avatar],
				    current: this.userInfo.avatar
				})
			},
			// getAvatar(avatar){
			// 	getImg(avatar).then(
			// 					res =>{
			// 						this.userInfo.avatar = res.data
			// 					}
			// 	)
			// },
			exit(){
				uni.showModal({
					title:'是否要退出登录O.o？',
					success: (res) => {
					    if (res.confirm) {
					      // 用户点击了确认按钮
							uni.setStorageSync('user','')
							uni.navigateTo({
								url:'/pages/login/login'
							})
					    } else if (res.cancel) {
					      // 用户点击了取消按钮
					    }
					  }
				})
			},
			updateUser() {
						this.updateInfo = this.userInfo
						this.$refs.inputDialog.open()
				},
			dialogInputConfirm( value){
					this.updateInfo.nickName = value
					update(this.updateInfo).then(
					res =>{
						if(res.code ===1){
							uni.showToast({
								title:'修改成功'
							})
							this.userInfo.nickName = value
							uni.setStorageSync('user',this.userInfo)
						}
					})
			},
				openFileSelector(){
					uni.chooseImage({
						success: (chooseImageRes) => {
							let base64Avatar='';
							const tempFilePaths = chooseImageRes.tempFilePaths;
							// const fs = uni.getFileSystemManager()
							// fs.readFile({
							//   filePath: tempFilePaths[0],
							//   encoding: 'base64',
							//   success: (data) => {
							//     const base64 = 'data:image/png;base64,' + data.data // 获取图片对应的 base64 字符串
							// 	base64Avatar  = base64
							//   }
							// })
							uni.uploadFile({
								url: uploadUrl, //仅为示例，非真实的接口地址
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
									'user': 'test'
								},
								success: (uploadFileRes) => {
									let uploadResObject =  JSON.parse(uploadFileRes.data)
									let fileName = uploadResObject.data.substring(uploadResObject.data.lastIndexOf('/') + 1);
									this.updateInfo = this.userInfo
									this.updateInfo.avatar = fileName
									update(this.updateInfo).then(res =>{
										if(res.code ===1){
											uni.showToast({
												title:'修改成功'
											})
											this.userInfo.avatar = fileName
											uni.setStorageSync('user',this.updateInfo)
										}
									}) 
								}
							});
						}
					})
				}
		}
	}
</script>

<style scoped>
.base-item{
	display: flex;
	align-items: center;
	padding: 10rpx;
	height: 100rpx;
	border-bottom: 1rpx #f4f4f4 solid;
	line-height: 100rpx;
}
</style>
