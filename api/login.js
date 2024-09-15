import request from '@/util/request'; // 封装的request.js文件的位置

// 微信登录
export const loginApi = (data) => {
	return request(`/user/login`, 'POST',data)
}
//退出登录
export const logout = (code,user) => {
	return request(`/sys/logout`, 'GET')
}
