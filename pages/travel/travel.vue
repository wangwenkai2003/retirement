<template>
	<view style="padding: 5rpx;">
		<scroll-view scroll-y="true" style="height: 92vh;">
			<!-- <image src="http://192.168.1.104:8086/common/download?name=anchor.jpg" mode="" style="width: 100px;height: 100px;"></image> -->
					<view @click="item.groupName !== undefined ? gotoGroup(item) : gotoChat(item)"  class="chat_item" v-for="(item) in messageList" >
					<img v-if="item.groupAvatar === undefined" :src="`${imgUrl}/common/download?name=${item.avatar}`" style="width: 160rpx;height: 160rpx;" alt="">
					<img v-if="item.groupAvatar !== undefined " :src="`${imgUrl}/common/download?name=${item.groupAvatar}`" style="width: 160rpx;height: 160rpx;" alt="">
					<view v-if="item.notRead!==0 && item.groupName=== undefined" style="border-radius: 50%;height: 40rpx;width: 40rpx;background-color: red;color: white;text-align: center;font-size: 12px;position: absolute; top: 1%;left: 150rpx;">{{item.notRead}}</view>
					<view v-if="item.groupName === undefined" style="display: flex;flex-direction: column;margin-left: 20rpx;"><h2 style="font-size: 18px;">{{item.nickName}}</h2>

					<view v-if="item.ifImg ===0" style="font-size: 12px;color: #999999;margin-top: 10rpx;">{{item.content}}</view>
					<view v-if="item.ifImg ===1" style="font-size: 12px;color: #999999;margin-top: 10rpx;">[图片]</view>
					 </view>	
					<view v-if="item.groupName !== undefined" style="display: flex;flex-direction: column;margin-left: 20rpx;"><h2 style="font-size: 18px;">{{item.groupName}}</h2>
					<view v-if="item.ifImg ===0 && item.content !=null" style="font-size: 12px;color: #999999;margin-top: 10rpx;">{{item.nickName}}:{{item.content}}</view>
					<view v-if="item.ifImg ===1" style="font-size: 12px;color: #999999;margin-top: 10rpx;">{{item.nickName}}:[图片]</view>
					 </view>
					 <view style="margin-left: auto;margin-bottom: auto;margin-top: 20rpx;color: #999999;">{{item.createTime | formatTimeToHourMinute}}</view>
			</view>
		</scroll-view>
		<view style="height: 8vh;display: flex;">
			<button @click="notif" style="width: 32.5vw;">好友请求</button>
			<button @click="Fup" style="width: 32.5vw;">好友列表</button>
			<button @click="initiateGroup" style=" width: 32.5vw;">发起群聊</button>
		 </view>
		 <uni-popup ref="popup" type="bottom" :maskClick="false">
			 <scroll-view scroll-y="true" style="height: 80vh;background-color: #fff;padding: 5rpx;">
				 <view style="display: flex;margin-bottom: 5rpx;"><uni-icons style="margin-left: auto;margin-right: 10rpx;" @click="close()" type="closeempty" size="30"></uni-icons></view>
				 <view class="friend_item" v-for="(item,index) in friends" :key="index">
						<img v-if="item.groupAvatar === undefined" :src="`${imgUrl}/common/download?name=${item.avatar}`" style="width: 130rpx;height: 130rpx;" alt="">
						<view>{{item.nickName}}</view>
				 </view>
			</scroll-view>
		 	<view style="width: 100vw; height: 15vh;background-color: #fff; padding: 5px; position: absolute;bottom: 0%;" >
		 			<uni-forms-item label="添加:" name="age">
		 				<view style="display: flex;padding: 5rpx;"><uni-easyinput type="text" v-model="friendPhone" placeholder="请输入账号"/>
						<uni-icons style="margin-right: 10rpx;" @click="confirm()" type="plusempty" size="30"></uni-icons></view>
		 			</uni-forms-item>
		 	</view>
		 </uni-popup>
		 <uni-popup ref="Npopup" type="bottom" :maskClick="false">
			 <scroll-view scroll-y="true" style="height: 80vh;background-color: #fff;padding: 5rpx;">
				 <view style="display: flex;margin-bottom: 5rpx;"><uni-icons style="margin-left: auto;margin-right: 10rpx;" @click="Nclose()" type="closeempty" size="30"></uni-icons></view>
				 <view class="friend_item" v-for="(item,index) in notificattions" :key="index">
						<img  :src="`${imgUrl}/common/download?name=${item.avatar}`" style="width: 130rpx;height: 130rpx;" alt="">
						<view>{{item.nickName}}</view>
						<view style="margin-left: auto;margin-right: 10rpx;display: flex;"><button type="primary" @click="agree(item)">同意</button><button @click="reject(item)" >拒绝</button></view>
				 </view>
			</scroll-view>
		 </uni-popup> 
		 <uni-popup ref="Gpopup" type="bottom" :maskClick="false">
				<view v-if="!ifNext" style="width: 100vw; height: 30vh;background-color: #fff; padding: 5px; position: absolute;bottom: 0%;" >
						<uni-forms-item label="群聊名:">
							<uni-easyinput type="text" v-model="group.groupName" placeholder="请输入群聊名"/>
						</uni-forms-item>
						<uni-forms-item label="群头像:">
							<img @click="openFileSelector" :src="group.groupAvatar" style="width: 50rpx;height: 50rpx;margin-left: 10rpx;" alt="">
						</uni-forms-item>
						<view style="display: flex;justify-content: space-around;">
							<button @click="Gclose" style="width: 48vw;">取消</button>
							<button @click="GroupNext" style="width: 48vw;">下一步</button>		
						</view>
				</view>
				<view v-if="ifNext">
					<scroll-view   scroll-y="true" style="height: 80vh;background-color: #fff;padding: 5rpx;">
					 <view class="friend_item" v-for="(item,index) in friends" :key="index">
							<img  :src="`${imgUrl}/common/download?name=${item.avatar}`" style="width: 130rpx;height: 130rpx;" alt="">
							<view>{{item.nickName}}</view>
							<view style="margin-left: auto;margin-right: 10rpx;"> <button :disabled="item.isInvited" @click="invite(item)">{{ item.isInvited ? '已邀请' : '邀请' }}</button></view>
					 </view>
					</scroll-view>
					<view style="display: flex;justify-content: space-around;background-color: #fff;">
						<button @click="Gclose" style="width: 49vw;">取消</button>
						<button @click="CreateGroup" style="width: 49vw;">创建</button>		
					</view>
				</view>
				
		 </uni-popup>
	</view>
</template>

<script>
	import {getChats} from '../../api/message.js'
	import {getUser} from '../../api/user.js'
	import config from '../../common/config.js'
	import { mapActions } from 'vuex';
	import {uploadUrl} from '../../api/img.js'
	import {saveGroup,saveGroupUser,getChatGroups} from'../../api/chatGroup.js'
	import {getFriends,addFriends,notifications,deleteFriend} from '../../api/friend.js'
 	export default {
		data() {
			return {
				messageList:[],
				userInfo:[],
				imgUrl: '',
				socket:'',
				userChats:[],
				groupChats:[],
				friendPhone:'',
				friends:[],
				notificattions:[],
				ifNext:false,
				group:{
					groupName:'',
					groupAvatar: ''
				},
				uploadUrl:uploadUrl,
				 isInvited: false,
				groupFriend:[], 
			}
		},
		  filters: {
		    formatTimeToHourMinute(value) {
		      if (!value) return '';
		      
		      // 将字符串转换为日期对象
		      var date = new Date(value);
		      
		      // 提取小时和分钟，并确保两位数显示
		      var hours = ("0" + date.getHours()).slice(-2);
		      var minutes = ("0" + date.getMinutes()).slice(-2);
		
		      // 返回格式化后的时分
		      return hours + ":" + minutes;
		    }
		  },
		onShow() {
			this.userInfo  =	uni.getStorageSync('user')
			this.imgUrl = config.APP_SERVER_URL
			this.getChats()
			this.group.groupAvatar = this.imgUrl + '/common/download?name='+'img.png'
			console.log(this.group.groupAvatar ,'tgg');
			// this.getgroups()
			this.socket = uni.connectSocket({
			url: config.WS_SERVER_URL + '/imserver/' + this.userInfo.phone,
			success: res => {
			console.log(res, 'res');
			console.info('创建连接成功');
		}
      })
      let that = this;
      this.socket.onMessage(function (event) {
        let resOb = JSON.parse(event.data);
        let cureentID = that.messageList.findIndex(item => item.from === resOb.from);
        that.messageList[cureentID].content = resOb.message;
        that.messageList[cureentID].notRead = that.messageList[cureentID].notRead + 1;

        let ctime = that.getTime();
        that.messageList[cureentID].createTime = ctime;
      });
	  uni.onSocketClose(function (res) {
	    console.log('WebSocket 已关闭！');
	  });
		},
		methods: {
			 ...mapActions(['initWebSocket']),
			gotoChat(item){
				this.socket.close();
				uni.navigateTo({
					url:"/pages/chat/chat?item="+ encodeURIComponent(JSON.stringify(item))
				})
			},
			openFileSelector(){
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						let filePath = tempFilePaths[0]
						this.group.groupAvatar = filePath
					}
				})
			},
			CreateGroup(){
				uni.uploadFile({
					url: uploadUrl, //仅为示例，非真实的接口地址
					filePath: this.group.groupAvatar,
					name: 'file',
					formData:{},
					header:{"Content-Type": "multipart/form-data"},
					success: (uploadFileRes) => {
						let uploadResObject =  JSON.parse(uploadFileRes.data)
						let fileName = uploadResObject.data.substring(uploadResObject.data.lastIndexOf('/') + 1);
						this.group.groupAvatar = fileName
						this.groupFriend.push(this.userInfo.phone)
						saveGroup(this.group.groupName,this.group.groupAvatar).then(res =>{
								if(res!== -1){
									saveGroupUser(res,this.groupFriend)
								}
						})
						}
				})
			},
			invite(item){
				if (!item.isInvited) {
				    item.isInvited = true;
					this.groupFriend.push(item.phone)
				}
			},
			Gclose(){
				this.$refs.Gpopup.close()
				this.group.groupAvatar=this.imgUrl + '/common/download?name='+'img.png'
				this.group.groupName=''
				this.ifNext = false
				this.groupFriend=[]
			},
			initiateGroup(){	
				this.$refs.Gpopup.open()
			},
			Fup(){
				this.getFriendInfo()
				this.$refs.popup.open()
			},
			getFriendInfo(){
				getFriends(this.userInfo.phone).then(res =>{
					this.friends = res 
				})
			},
			GroupNext(){
				this.ifNext = true
				this.getFriendInfo()
				this.friends.map(friend => ({
				        friend,
				        isInvited: false,
				      }))
				console.log(this.friends,'tfr');
			},
			agree(item){
				console.log(item,'itm');
				let data={}
				data.userId= this.userInfo.phone
				data.friendId = item.phone
				addFriends(data).then(res =>{this.notificattions =	this.notificattions.filter(itx => (itx.phone !== item.phone))})
			},
			reject(item){
				let data={}
				data.userId= item.phone
				data.friendId = this.userInfo.phone
				deleteFriend(data).then(res =>{
				this.notificattions =	this.notificattions.filter(itx => (itx.phone !== item.phone))
				})
			},
			notif(){
				notifications(this.userInfo.phone).then(res =>{
					this.notificattions = res
					this.$refs.Npopup.open()
				})
			},
			Nclose(){
				this.$refs.Npopup.close()
			},
			close() {
					this.clear()
					this.$refs.popup.close()
					},
			clear(){
				this.friendPhone = ''
			},		
			confirm() {
				console.log(this.friendPhone,'friendPhone');
				let friendIndex = this.friends.findIndex((friend) => friend.phone === this.friendPhone);
				if(friendIndex===-1){
					let data={}
					data.userId= this.userInfo.phone
					data.friendId = this.friendPhone
					addFriends(data).then(res =>{
						uni.showToast({
							title:'已发送好友请求'
						})
					})
				}else{
					uni.showToast({
						title:'该好友已添加',
						icon:'error'
					})
				}
				
			},
			gotoGroup(item){
				console.log(this.groupChats);
				for (const groupId in this.groupChats) {
					if (Object.prototype.hasOwnProperty.call(this.groupChats, groupId) && Array.isArray(this.groupChats[groupId])) {
						  const lastMessage = this.groupChats[groupId][this.groupChats[groupId].length - 1];
						  if (lastMessage && lastMessage.groupId === item.groupId) {
											let messageGroups = this.groupChats[groupId]
											messageGroups.groupName = item.groupName
											messageGroups.groupId = item.groupId
											console.log(messageGroups,'mgp');
											uni.navigateTo({
												url:'/pages/chat/groupChat?groups='+ encodeURIComponent(JSON.stringify(messageGroups))
									})
						  }
						}
				  }
			},
			getChats(){
				this.messageList = []
				getChats(this.userInfo.phone).then(
					res=>{
						if(res.code ===1){
							for (var key in res.data) {
								let messageValue =  res.data[key]
								let notRead= messageValue.filter(item => (item.ifReceive ===0 && item.to === this.userInfo.phone))
								let lastMessage =  messageValue[messageValue.length-1]
								const newKey = key.split('-')
								let filterKey = newKey.filter(item => item !== this.userInfo.phone)
								// console.log(filterKey);
								getUser(filterKey).then(res =>{
										console.log(res.data,'ress');
										res.data.notRead = notRead.length 
										var mergedObject = { ...lastMessage, ...res.data};
										this.messageList.push(mergedObject)
								})
								
								// request.get('/user/getUserByAccount?account='+filterKey).then(
								// res=>{
								// 	var mergedObject = { ...lastMessage, ...res.data.data };
								// 	messageList.value.push(mergedObject)
								// })
							}
						}
					}
				)
				this.getgroups()
			},
			getgroups(){
				getChatGroups(this.userInfo.phone).then(res =>{
					let groupedRes = res.reduce((acc, curr) => {
					  if (!acc[curr.groupId]) {
					    acc[curr.groupId] = [];
					  }
					  acc[curr.groupId].push(curr);
					  return acc;
					}, {});
					
					// 然后遍历分组后的结果，统计每个组中未读消息数量，并添加到原始对象上
					Object.keys(groupedRes).forEach(groupId => {
					  let noReadCount = groupedRes[groupId].reduce((acc, curr) => {
					    return acc + (curr.ifReceive === 0 ? 1 : 0);
					  }, 0);
					
					  // 添加一个新属性来记录该组的未读消息数量
					  groupedRes[groupId].notRead = noReadCount;
					});
					this.groupChats = groupedRes
					console.log(groupedRes);
					
					let lastItems = Object.keys(groupedRes).map(groupId => {
					  let lastMessage = groupedRes[groupId][groupedRes[groupId].length-1];
					  // 获取未读消息数量
					  let unreadCount = groupedRes[groupId].reduce((acc, curr) => acc + (curr.ifReceive === 0 ? 1 : 0), 0);
					
					  // 将未读消息数量添加到最后一条消息对象中
					  lastMessage.notRead = unreadCount;
					
					  return lastMessage;
					});
					console.log(lastItems);
					lastItems.forEach((item,index) => {
					  this.messageList.push(item);
					});	
					this.messageList.sort((a, b) => {
					  // 将字符串时间转换为Date对象以比较
					  const dateA = new Date(a.create_time);
					  const dateB = new Date(b.create_time);
					
					  // 升序排列：较早的时间排在前面
					  return dateB - dateA;
					});
					console.log(this.messageList,'ts');				
				})
			},
			onUnload(){
			 	this.socket.close()
			},
			getTime(){
			 // 获取当前时间
			  var now = new Date();
			
			  // 提取年、月、日、小时和分钟
			  var year = now.getFullYear();
			  var month = ("0" + (now.getMonth() + 1)).slice(-2); // 注意：getMonth()返回的是0-11的数字，需要加1
			  var day = ("0" + now.getDate()).slice(-2);
			  var hours = ("0" + now.getHours()).slice(-2);
			  var minutes = ("0" + now.getMinutes()).slice(-2);
			
			  // 格式化输出为 年-月-日 时:分
			  var currentTimeFormatted = year + "-" + month + "-" + day + " " + hours + ":" + minutes;
			
			  return currentTimeFormatted;
			}
		}
	}
</script>

<style scoped>
.chat_item{
		height: 15vh;
		border-bottom:1px solid #f4f4f4 ;
		padding: 20rpx;
		display: flex;
		align-items: center;
	}
.friend_item{
	height: 10vh;
	border-bottom:1px solid #f4f4f4 ;
	padding: 10rpx;
	display: flex;
	align-items: center;
}	
</style>
