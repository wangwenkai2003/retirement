<template>
	<view style="padding: 5px;">
			<scroll-view scroll-y="true" style="height: 90vh;width: 100%;">
				<view v-for="(item,index) in contacts" :key="index" style="display: flex;background-color: #d8d8d8;border: #f4f4f4 1px solid ;padding: 5px;"  @click="callPhone(item.phone)">
					<view style="font-size: 20px;font-weight: 700;">{{item.name}}:</view> <view  style="font-size: 20px;color: #2247c8;">{{item.phone}}</view>
					<view style="margin-left: auto;">
						<button @click.stop="edit(item)" type="default" size="mini" style="margin-right: 1px;">编辑</button>
						<button @click="callPhone(item.phone)" type="primary" size="mini">拨打</button>
					</view>
					
				</view>
			</scroll-view>
		<view ><button @click="open()" type="primary">添加紧急联系人</button></view>
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="" style="width: 100vw; height: 40vh;background-color: #fff; padding: 5px;" >
				<uni-forms-item label="姓名:" name="name">
								<uni-easyinput type="text" v-model="contact.name" placeholder="请输入姓名" />
							</uni-forms-item>
							<uni-forms-item label="电话:" name="age">
								<uni-easyinput type="text" v-model="contact.phone" placeholder="请输入电话" />
					</uni-forms-item>
					<view  style="display: flex;">
						<button  @click="close()" size="mini">取消</button>
					   <button type="primary" @click="confirm()" size="mini">提交</button>
					   <button type="warn" @click="deleteC()" size="mini">删除</button>
					
					</view>
			</view>
		
		</uni-popup>
	</view>
</template>

<script>
	import {saveContact} from '@/api/contact.js'
	import {getConcacts,updateContact,deletContact}  from '@/api/contact.js'
	export default {
		data() {
			return {
				contacts:[]	,
				contact:{
					name: '',
					phone:'',
					userPhone: '13307223604'
				},
				isSave: true
			}
		},
		onShow() {
			this.concactList()
		},
		methods: {
			open() {
						this.$refs.popup.open()
					},
			close() {
						this.clear()
						this.$refs.popup.close()
						this.concactList()
					},
			clear(){
				this.isSave = true
				this.contact.name='',
				this.contact.phone =''
			},		
			confirm() {
			let itemIndex = this.contacts.findIndex(item => item.phone === this.contact.phone);
			if (itemIndex !== -1) {
			  // 使用 Vue 的 $set 方法确保视图更新
			  uni.showToast({
			  	title:'该电话已存在',
				icon:'error'
			  })
			  // this.clear()
			}else{
				if(this.isSave){
					saveContact(this.contact).then(res=>{
						if(res.code ===1){
							uni.showToast({
								title:'添加成功'
							})
						}
						})
				}else{
					updateContact(this.contact).then(res=>{
						if(res.code ===1){
							uni.showToast({
								title:'修改成功'
							})
						}
						this.isSave=true
					})
				}
				this.clear()
				this.$refs.popup.close()
				this.concactList()
			}
			},
			concactList(){
				getConcacts().then(res=>{
					this.contacts = res.data
				})
			},
			callPhone(phone) {
			   uni.makePhoneCall({
			     phoneNumber: phone, // 需要拨打的电话号码
			     success: () => {
			       console.log('拨打电话成功');
			     },
			     fail: (err) => {
			       console.log('拨打电话失败', err);
			     }
			   });
			 },
			 edit(item){
				 this.contact = item;
				 this.isSave = false
				 this.$refs.popup.open()
			 },
			 deleteC(){
				 let that = this
				 uni.showModal({
				 	title: '提示',
				 	content: '您确定要删除吗',
				 	success: function (res) {
				 		if (res.confirm) {
				 			// console.log('用户点击确定');
							deletContact(that.contact.phone).then(res =>{
								if(res.code===1){
									that.$refs.popup.close()
									that.concactList()
								}
								
							})
				 		} else if (res.cancel) {
				 			// console.log('用户点击取消');
							that.contact.name='',
							thithats.contact.phone =''
							that.isSave = false
							// this.$refs.popup.()
				 		}
				 	}
				 })
			 },
		}
	}
</script>

<style>

</style>
