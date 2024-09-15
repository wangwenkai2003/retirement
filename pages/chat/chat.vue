<template>
	<view>
	 <scroll-view  style="display: flex;flex-direction: column;height: 100vh;padding-top: 20rpx;"  class="container" scroll-y="true" 
		:scroll-into-view="scrollToView" ref="scrollContainer"  @scrolltoupper="onScrollTop">
	      <view v-for="(item,index) in infoList" :key="index" :id="'msg' + item.id" style="display: flex;margin-bottom: 20rpx" ref="myView">
	        <view v-if="item.from === toUserInfo.phone" style="margin-right: auto;margin-left: 10rpx;display: flex;align-items: center;">
	          <img :src="`${imgUrl}/common/download?name=${toUserInfo.avatar}`"  style="width: 120rpx;height: 120rpx;border-radius: 50%;">
	          <view v-if="item.ifImg===0" style="background-color: #f5f5f5; padding: 20rpx;font-size: 15px;margin-left: 20rpx;border-radius: 10rpx;">{{item.content}}</view>
	          <view style="border-radius: 10rpx;" v-if="item.ifImg===1">
	            <image mode="aspectFill" @click="previewImage(item.img)" style="margin-left: 20rpx;width: 300rpx;height: 300rpx" :src="`${imgUrl}/common/download?name=${item.img}`"></image>
	          </view>
	        </view>
	        <view v-if="item.from === userInfo.phone" style="margin-left: auto;margin-right: 10rpx;display: flex;align-items: center;">
	          <view style="background-color: #5cd375; padding: 20rpx;font-size: 15px;margin-right: 20rpx;border-radius: 10rpx;" v-if="item.ifImg===0">{{item.content}}</view>
	          <view style="border-radius: 10rpx;" v-if="item.ifImg===1">
	            <image mode="aspectFill" @click="previewImage(item.img)" style="margin-right: 20rpx;width: 300rpx;height: 300rpx" :src="`${imgUrl}/common/download?name=${item.img}`"></image>
	          </view>
	          <img :src="`${imgUrl}/common/download?name=${userInfo.avatar}`" style="width: 120rpx;height: 120rpx;border-radius: 50%;">
	        </view>
	      </view>
		  <view style="height:80rpx;"></view>
	  </scroll-view>
	  <view class="bottom-bar">
	    <img @click="openFileSelector" src="@/static/img.png" style="width: 50rpx;height: 50rpx;margin-left: 10rpx;" alt="">
	    <input type="text" v-model="info.content" placeholder="请输入消息" class="input-box" />
	    <button type="primary" size="mini" style="margin-right: 20rpx;" class="send-btn" @click="sendMsg">发送</button>
	  </view>
	  </view>
</template>

<script>
	import {getMessagePage,send,setChat} from '../../api/chat.js'
	import config from '@/common/config.js'
	import {uploadUrl} from '../../api/img.js'
	export default {
		data() {
			return {
				infoList:[],
				userInfo:{},
				toUserInfo:{},
				page : {
					fromAccount:'',
					toAccount:'',
					currentLimit:0,
					limit:10
				},
				isAdd: true,
				imgUrl:'',
				socket:'',
				//消息表单
				info:{
					id:'',
					from:'',
					to:'',
					content:'',
					ifReceive: 0,
					ifImg:0
				},
				currentId: 0, 
				scrollToView :'',
				//接受消息表单
				reInfo:{
					from:'',
					content:'',
					ifImg:0
				}
			}
		},
		onLoad(option) {
			let that = this
			this.userInfo =	uni.getStorageSync('user')
			const item = JSON.parse(decodeURIComponent(option.item));
			this.toUserInfo = item
			// console.log(this.toUserInfo,'tttpf');
			uni.setNavigationBarTitle({
				title:this.toUserInfo.nickName
			})
			this.getMessagePages()
			this.imgUrl = config.APP_SERVER_URL
			this.socket = uni.connectSocket({
			  url: config.WS_SERVER_URL + '/imserver/' + this.userInfo.phone,
			  success: res => {
			    console.log(res, 'res');
			    console.info('创建连接成功');
			  }
			})
			//服务器发送监听
			this.socket.onMessage(function (event) {
				  //   if (event.data instanceof ArrayBuffer) { // 如果是ArrayBuffer类型（通常是图片或二进制文件）
				  //     let arrayBuffer = event.data;
				  //     // 将ArrayBuffer转换为Blob对象以便进一步操作（如显示在页面上）
				  //     let blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // 根据实际情况调整MIME类型
						// console.log(blob,'bl');
				  //   } else if (typeof event.data === 'string') {
						let ws = JSON.parse(event.data)
						that.reInfo.content =''
						that.reInfo.img=''
						if(ws.type===0){
							// 如果是文本消息
							that.reInfo.from = that.toUserInfo.phone
							that.reInfo.content = ws.message
							that.reInfo.ifImg=0
							that.infoList = [...that.infoList, that.reInfo];
						}else{
							that.reInfo.from = that.toUserInfo.phone
							that.reInfo.img=ws.message
							that.reInfo.ifImg = 1
							that.infoList = [...that.infoList, that.reInfo];
						}
					let ackInfo={
						from:that.toUserInfo.phone,
						to:that.userInfo.phone,
						type: 'ack'
					}	
					uni.sendSocketMessage({data:  JSON.stringify(ackInfo)} );
			})
			this.updateRead()
		},
		onUnload(){
		 	this.socket.close()
		},
		methods: {
			updateRead(){
				setChat(this.toUserInfo.phone,this.userInfo.phone).then(res =>{console.log(res,'res'); })
			},
			getMessagePages(){
				this.page.fromAccount = this.userInfo.phone
				this.page.toAccount = this.toUserInfo.phone
				  if (!this.isAdd ) {
				    return
				  }
				getMessagePage(this.page).then(res =>{
					if (res.code === 1) {
				   if (res.data.length < this.page.limit) {
				     this.isAdd  = false
				   } else {
				    this.page.currentLimit=this.page.currentLimit+10
				   }
				  this.infoList = [...res.data, ...this.infoList];
				  this.currentId = this.infoList[this.infoList.length-1].id
				  console.log(this.infoList[this.infoList.length-1].id);
					this.scrollToView = 'msg' + this.infoList[this.infoList.length-1].id;
				 }else{
				 	  this.isAdd = false
				 }
				 })
			},
			 onScrollTop(){
				 console.log('xxx');
				 this.getMessagePages()
			 },
			sendMsg(){
				if(this.info.content!=='' || this.info.img!==''){
					let sendInfo = {}
					console.log(this.userInfo.phone,'tup');
					sendInfo.from = this.userInfo.phone
					sendInfo.content = this.info.content
					sendInfo.ifImg = 0
					this.currentId =parseInt(this.currentId) +1
					sendInfo.id = this.currentId
					this.info.from =  this.userInfo.phone
					this.info.to = this.toUserInfo.phone
					this.info.ifImg = 0
					this.info.img = ''
					uni.sendSocketMessage({
						data:JSON.stringify(this.info)
					})
					let that = this
					send(this.info).then(
						res =>{
							if(res.code===1){
								console.log(res);
								this.infoList.push(sendInfo)
								this.$nextTick(function(){
									console.log(that.infoList[that.infoList.length-1]);
									that.scrollToView = 'msg' + that.infoList[that.infoList.length-1].id;
								});			
							}
						}
					)
					this.infoClear()
				}
			},
		 	 openFileSelector(){
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						let filePath = tempFilePaths[0]
						uni.uploadFile({
							url: uploadUrl, //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData:{},
							header:{"Content-Type": "multipart/form-data"},
							success: (uploadFileRes) => {
								let uploadResObject =  JSON.parse(uploadFileRes.data)
								let fileName = uploadResObject.data.substring(uploadResObject.data.lastIndexOf('/') + 1);
								this.infoClear()
								this.info.ifImg = 1
								this.info.img = fileName
								let that = this 
								send(this.info).then(res =>{
									if(res.code ==1){
										that.infoList.push(that.info)
										uni.sendSocketMessage({
											data:JSON.stringify(this.info)
										})
									}
								})
								
							}
						});
					}
				})
			},
			infoClear(){
				this.info.content='',
				this.info.from = this.userInfo.phone,
				this.info.to = this.toUserInfo.phone,
				this.info.ifReceive = 0
				this.info.ifImg=0,
				this.info.img = ''
			},
			previewImage(img){
				uni.previewImage({
				    urls: [`${this.imgUrl}/common/download?name=${img}`],
				    current: `${this.imgUrl}/common/download?name=${img}`
				})
			}
		}
	}
</script>

<style>
.messageView{
}
.bottom-bar {
  position: fixed;
  bottom: 0rpx; /* 底部距离 */
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
}

.input-box {
  flex: 1;
  height: 100%;
  padding: 0 10px;
  font-size: 16px;
  border: none;
  outline: none;
}
</style>
