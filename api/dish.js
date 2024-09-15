import request from '@/util/request'; 
export const getDishsByCategoryId = (id) => {
	return request(`/dish/getByCategoryId?categoryId=`+ id, 'GET')
}