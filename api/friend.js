import request from '@/util/request'; 
export const getFriends = (data) => {
	return request(`/friend/getFriends?userId=`+ data, 'GET')
}
export const addFriends = (data) => {
	return request(`/friend/addFriend?userId=${data.userId}&friendId=${data.friendId}`, 'POST')
}
export const notifications = (data) => {
	return request(`/friend/notifications?userId=`+data, 'GET')
}
export const deleteFriend =(data)=>{
	return request(`/friend/deleteFriend?userId=${data.userId}&friendId=${data.friendId}`, 'DELETE')
}
