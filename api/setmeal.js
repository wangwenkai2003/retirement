import request from '@/util/request'; 
export const getSetmeal = (data) => {
	return request(`/setmeal/page`, 'GET')
}