import request from '@/util/request'; 
export const getCategory = (data) => {
	return request(`/category/list`, 'GET')
}
export const down = () => {
	return request(`/video/download-video`, 'GET')
}