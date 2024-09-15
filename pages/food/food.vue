<template>
  <view class="container">
    <view class="header" style="height: 20vh; padding: 10rpx;background-color: #fff;border-bottom: 1px solid #f4f4f4; ">
      <view class="header-top" style="display: flex;width: 100%;height: 100%;align-items: center; ">
		  <image src="../../static/logo.png" style="width: 25%;height:85%;"></image>
		  <view class="header-right">
				<view style="font-size: 20px;font-weight: 700;margin-bottom: 10rpx;margin-left: 15rpx;">长寿面馆</view>
				  <view style="display: flex;align-items: center;">
					<image src="../../static/distant.jpg" style="width: 20px; height: 20px;"></image> <span>距离1.5km</span> 
					</view>
					<view style="display: flex;align-items: center;">
					<image src="../../static/clock.jpg" style="width: 20px; height: 20px;"></image> <span>预计时长12min</span> 
					</view>
					<view @click="callPhone()">
						<image src="../../static/phone.svg" style="width: 20px; height: 20px;"></image> <span style="color: #48a2c5;">12312312311</span> 
					</view>
					</view>
		  </view>
	  </view>
	<view class="banner" style="display: flex;">
		<view class="menu" style="width: 20%;">
			<scroll-view scroll-y="true" style="height: 78vh;width: 100%;">
		  <view v-for="(item, index) in menuItems" :key="index" :style="{ backgroundColor: index === categoryIndex ? '#ffffff' : '#f6f6f6' }"  style="height: 10%; display: flex;align-items: center;justify-content: center;"  @click="selectCategory(index,item)">
			  <span>{{item.name}}</span>
		  </view>
		  </scroll-view>
		</view>
		<view class="dish" style="width: 78%;margin-left: 2rpx;">
			<scroll-view scroll-y="true" style="height: 78vh;width: 100%;">
						<view v-for="(item,index) in currentDishs" :key="index" style="width: 100%;;height: 200rpx; display: flex;background-color: #fff;" >
						<image :src="item.image"  style="width: 25%;height: 100%; "></image>
						<view style="display: flex;justify-content: center;align-items: center; flex-direction: column;margin-left: 15rpx;">
							<view style="font-size: 20px; font-weight: 700;margin-bottom: auto;margin-top: 20rpx;">{{item.name}}</view>
							<view style="color: red; margin-bottom: 5rpx;">￥{{item.price/100}}</view>
						</view>	
						<view class="" style="margin-top: auto;margin-left: auto;margin-right: 10rpx;margin-bottom: 10rpx;">
							<button style="background-color: #f0bd0a;" @click="addOrder(item)">加入订单</button>
						</view>
						</view>
					</scroll-view>
		</view>
	</view>
    <view class="footer" @click="viewOrderInfo" style=" position: fixed;bottom: 5%;left: 25%; width: 70vw;">
      <view style="display: flex;background-color: #000000;align-items: center;padding: 5px;border-radius: 10px;">
		 <view style="color: red; font-weight: 700;">￥{{goodsPrice}}</view>
		 <!-- <button style="margin-left: auto;">去结算</button>-->
		 <view  style="margin-left: auto;" ><button :style="{ backgroundColor: goodsPrice >0 ? '#f0bd0a' : '#d8d8d8' }" style="color: #fff;">去结算</button></view>
	  </view>
    </view>
	<uni-popup ref="popup" type="bottom">
			<scroll-view scroll-y="true" style="height: 50vh;width: 100%;background-color: #fff;">
			<view v-for="(item,index) in orderList" :key="index" style="width: 100%;;height: 150rpx; display: flex;background-color: #fff;">
				<image :src="item.image"  style="width: 25%;height: 100%; "></image>
				<view style="display: flex;justify-content: center;align-items: center; flex-direction: column;margin-left: 15rpx;background-color: #fff;">
					<view style="font-size: 20px; font-weight: 700;margin-bottom: auto;margin-top: 20rpx;">{{item.name}}</view>
					<view style="color: red; margin-bottom: 5rpx;">￥{{item.price/100}}</view>
				</view>
				<view style="margin-left: auto;margin-right: 10px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<view style="display: flex; align-items: center; ">
						<image src="../../static/sub.svg"  @tap="decreaseAmount(item)" style="width: 16px;height: 16px;margin-right: 1px;"></image>
						{{item.amount}}
						<image src="../../static/add.svg" @tap="increaseAmount(item)"   style="width: 16px;height: 16px;margin-left: 1px"></image>
						</view>
					<view style="color: red;margin-top: 5px;margin-right: 2px;">￥{{item.amount*item.price/100}}</view>	
				</view>
				
					
			</view>
			</scroll-view>
	</uni-popup>
  </view>
</template>

<script>
import {getCategory} from "../../api/category.js"
import {getDishsByCategoryId}  from "../../api/dish.js"
export default {
  data() {
    return {
      menuItems: [
      ],
	  categoryIndex: 0,
		// colorList:["blue","red","yellow"],
		currentDishs:[],
		orderList:[]
    };
  },
  onLoad() {
  	this.getCategorys()
  },
  computed:{
	    goodsPrice(){
	                let price = 0
	                this.orderList.forEach(item=>{
	                  price += (item.amount * item.price/100)
	                })
	                return price
	              }
  },
  methods: {  
	viewOrderInfo(){
		this.$refs.popup.open()
	},
    goToCheckout() {
      // 跳转到结算页面
    },
	getCategorys(){
		getCategory().then(res=>{
			this.menuItems = res.data;
			this.getByCategoryId(this.menuItems[0].id)
			console.log(this.menuItems,"mm");
		})
	},
	selectCategory(index,item){
		this.categoryIndex = index;
		this.getByCategoryId(item.id)
	},
	getByCategoryId(id){
		getDishsByCategoryId(id).then(res=>{
				this.currentDishs = res.data;
				console.log(this.currentDishs,'cd');
		})
	},
	   callPhone() {
	      uni.makePhoneCall({
	        phoneNumber: "13307223604", // 需要拨打的电话号码
	        success: () => {
	          console.log('拨打电话成功');
	        },
	        fail: (err) => {
	          console.log('拨打电话失败', err);
	        }
	      });
	    },
		addOrder(dish){
			console.log(this.orderList);
			if(this.orderList.some(item => item.name === dish.name)){
				let existingItemIndex = this.orderList.findIndex(item => item.name === dish.name);
				if (existingItemIndex !== -1) {
				  // 使用 Vue 的 $set 方法确保视图更新
				  this.$set(this.orderList[existingItemIndex], 'amount', this.orderList[existingItemIndex].amount + 1);
				}
			}else{
				let orderDish={
					name: dish.name,
					amount: 1,
					price: dish.price,
					image: dish.image
				}
				this.orderList.push(orderDish)
				// console.log(this.orderList);
			}
		},
		increaseAmount(item) {
		  if (item.amount < Infinity) {
		    this.$set(item, 'amount', item.amount + 1);
		
		    if (item.amount <= 0) {
		      const index = this.orderList.indexOf(item);
		      if (index > -1) {
		        this.orderList.splice(index, 1);
		      }
		    }
		  }
		},
		decreaseAmount(item) {
		  if (item.amount > 0) {
		    this.$set(item, 'amount', item.amount - 1);
		
		    if (item.amount <= 0) {
		      const index = this.orderList.indexOf(item);
		      if (index > -1) {
		        this.orderList.splice(index, 1);
		      }
		    }
		  }
		}
  }
};
</script>

<style scoped>
	.scroll-Y {
			height: 300rpx;
		}
		.scroll-view_H {
			white-space: nowrap;
			width: 100%;
		}
		.scroll-view-item {
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
			font-size: 36rpx;
		}
		.scroll-view-item_H {
			display: inline-block;
			width: 100%;
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
			font-size: 36rpx;
		}
</style>