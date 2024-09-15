<template>
  <view class="login-page">
    <!-- Logo部分 -->
    <view class="logo-container">
      <img class="logo-image" src="../../static/logo.png" alt="" />
    </view>
    <!-- 登录表单部分 -->
    <view class="form-container">
      <view class="input-container">
        <input type="text"  placeholder="手机号/用户名" v-model="username" />
      </view>
      <view class="input-container">
        <input type="password" placeholder="密码" v-model="password" />
      </view>
      
      <button type="primary" @tap="handleLogin">登录</button>
    </view>
  </view>
</template>

<script>
import {login} from '@/api/user.js'
import { fail } from 'assert';
import {getImg} from '../../api/img.js'
export default {
  data() {
    return {
      // 替换为你的logo地址
      username: '',
      password: ''
    };
  },
  methods: {  
    handleLogin() {
		let user={}
		user.phone = this.username
		user.name=this.password
      // 这里添加实际的登录逻辑，例如调用后端接口进行验证
		login(user).then(res=>{
			if(res.code===1){				
				uni.setStorageSync('user', res.data);
				uni.redirectTo({
					url:"/pages/index/index"
				})
			}else{
			uni.showToast({
				title:'您的账号或密码有误',
				icon:'error'
			})
			}
		})
      // console.log('登录请求：', this.username, this.password);
      // uni.request(...) 或其他登录处理方式
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  width: 100vw;
  height: 100vh;
}

.logo-container {
	margin-top: 30px;
  margin-bottom: 10px;
  
  margin-left: auto;
  margin-right: auto;
}

.logo-image {
	width: 100px;
	height: 100px;
}

.form-container {
  width: 80%;
}

.input-container {
	border: 1px solid #f4f4f4;
	padding: 10px;
  margin-bottom: 5px;
}
</style>