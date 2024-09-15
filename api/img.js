import request from '@/util/request'; 
export const getImg = (data) => {
	return request(`/common/getImg?name=`+ data, 'GET')
}

export const upload =(data) =>{
	return request('/common/upload','POST',data)
}

export const uploadUrl = 'http://192.168.1.104:8086/common/upload'