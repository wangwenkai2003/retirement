import request from '@/util/request'; 
export const getChats = (data) => {
	return request('/chat/getChats?formUser='+data, 'GET')
}