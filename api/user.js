import request from '@/util/request'; // 封装的request.js文件的位置

// 微信登录
export const getOpenId = (code) => {
	return request(`/sys/wexin/login?code=${code}`, 'POST')
}
//账号密码登录
export const login=(user)=>{
	return request('/user/login/password','POST',user);
}
//退出登录
export const logout = (code,user) => {
	return request(`/sys/logout`, 'GET')
}

export const update = (user)=>{
	return request('/user/update','PUT',user)
}

export const getUser =(phone) =>{
	return request('/user/get?phone='+phone,'GET')
}

