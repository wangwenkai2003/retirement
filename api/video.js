import request from '@/util/request';

export const list =() =>{
	return request('/video/list','GET')
}