import request from '@/util/request'; 
export const getConcacts = () => {
	return request(`/contact/list`, 'GET')
}
export const saveContact = (data) => {
	return request(`/contact/save`, 'POST',data)
}

export const updateContact = (data)=>{
	return request(`/contact/update`, 'PUT',data)
}

export const deletContact = (data)=>{
	return request(`/contact/delete?phone=`+ data, 'PUT')
}