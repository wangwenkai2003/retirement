import request from '@/util/request'; 
export const getMessagePage = (data) => {
	return request(`/chat/getMessagePage`, 'GET', data)
}

export const send = (data) =>{
	return request('/chat/send','POST',data)
}

export const setChat = (form,to)=>{
	return request(`/chat/setChatRead?fromUserId=${form}&toUserId=${to}`, 'POST');
}