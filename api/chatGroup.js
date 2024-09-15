import request from '@/util/request'; 
export const getChatGroups = (from) => {
	return request(`/chatGroup/getAll?from=`+ from, 'GET')
}
export const sendToGroup = (data) =>{
	return request('/chatGroup/send','POST',data)
}
export const saveGroup = (groupName,groupAvatar)=>{
	return request(`/chatGroup/saveGroup?groupName=${groupName}&groupAvatar=${groupAvatar}`,'POST')
}
export const saveGroupUser = (groupId,userIds)=>{
	return request(`/chatGroup/saveGroupUser?groupId=${groupId}&userIds=${userIds}`,'POST')
}
