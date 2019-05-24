import Vue from 'vue'
import Vuex from 'vuex'
import states from '../states/index.js'
import api from '../service/index.js'
import { checkIsStartWithLoad } from '../utils/utils.js'
import { request, delay } from '../utils/request.js'

Vue.use(Vuex)

console.warn(states, 'states')
console.warn(api, 'api')

const store = new Vuex.Store({
    state: states,
    mutations: {
		saveOrUpdate(state, { key, value }) {
			console.warn('key', key)
			console.warn('value', value)
			state[key] = { ...state[key], ...value }
        }
	},
    actions: { 
		// 不会存在数据污染问题
		async asyncReqData({state, commit}, {payload}) {
			let checkResVal = {
				props: '',
				preProp: '',
				prop: ''
			}
			// 校验apiKey 必须存在
			if(!payload || !payload.apiKey) {
				console.error('asyncReq function params object must has apiKey property. \n')
				return checkResVal;
			};
			console.warn('apiKey:', typeof payload.apiKey)
			// 校验api[payload.apiKey] 必须存在
			if(!api[payload.apiKey]) {
				console.error(`please checkout service configuration file has ${payload.apiKey} object declare ? \n`)
				return checkResVal;
			};
			// 校验states 是否存在 payload.apiKey 或者 payload.stateKey
			if (payload.stateKey && !states[payload.stateKey]) {
				console.error(`please checkout states configuration file has ${payload.stateKey} object declare1 ? \n`)
				return checkResVal;
			} else if (!states[payload.apiKey]) {
				console.error(`please checkout states configuration file has ${payload.apiKey} object declare1 ? \n`)
				return checkResVal;
			}
			
			// 处理是否启用接口
			const isLoadStart = checkIsStartWithLoad(payload.stateKey || payload.apiKey)
			console.warn('isLoadStart:', isLoadStart)
			isLoadStart && commit('saveOrUpdate', {
				key: payload.stateKey || payload.apiKey,
				value: {
					loading: true,
					loaded: false
				}
			})
			const serviceObj = api[payload.apiKey];
			// 处理异步请求为同步
			let data = await request({
				url: serviceObj.url,
				method: payload.method || serviceObj.method || 'GET',
				headers: payload.headers || serviceObj.headers || '',
				params: payload.params || serviceObj.params || ''
			});
			console.warn('data:', data)
			if(!data) { // 请求数据异常
				isLoadStart && commit('saveOrUpdate', {
					key: payload.stateKey || payload.apiKey,
					value: {
						loading: false,
						loaded: true
					}
				})
				return {
					props: state,
					preProp: state[payload.stateKey || payload.apiKey] || '',
					prop: ''
				}
			} 
			console.warn('data-:', data)
			// 处理数据
			const handleData = serviceObj.handler && serviceObj.handler({
				props: state,
				prop: state[payload.stateKey || payload.apiKey] || '',
				resData: data
			}) || data
			
			
			// 处理响应数据
			const resData = {
				props: state,
				preProp: state[payload.stateKey || payload.apiKey] || '',
				prop: handleData
			}
			
			// 保存数据
			isLoadStart ? commit('saveOrUpdate', {
				key: payload.stateKey || payload.apiKey,
				value: {
					loading: false,
					loaded: true,
					...handleData
				}
			}) : commit('saveOrUpdate', {
				key: payload.stateKey || payload.apiKey,
				value: handleData
			})
			console.warn("resData", resData)
			// 返回后台返回的数据
			return resData
		}
	}
})

export default store