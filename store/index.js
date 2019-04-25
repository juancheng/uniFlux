import Vue from 'vue'
import Vuex from 'vuex'
import states from '../states/index.js'
import * as api from '../service/index.js'
import { checkIsStartWithLoad } from '../utils/utils.js'
import { request, delay } from '../utils/request.js'

Vue.use(Vuex)

console.warn(states, 'states')

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
			// 处理是否启用接口
			const isLoadStart = checkIsStartWithLoad(payload.stateKey)
			console.warn('isLoadStart:', isLoadStart)
			isLoadStart && commit('saveOrUpdate', {
				key: payload.stateKey,
				value: {
					loading: true,
					loaded: false
				}
			})
			// 处理异步请求为同步
			let data = await request({
				url: api[payload.apiKey || payload.stateKey].url,
				method: payload.method || api[payload.apiKey || payload.stateKey].method || 'GET',
				headers: payload.headers || api[payload.apiKey || payload.stateKey].headers || '',
				params: payload.params || api[payload.apiKey || payload.stateKey].params || ''
			});
			console.warn('data:', data)
			if(!data) { // 请求数据异常
				isLoadStart && commit('saveOrUpdate', {
					key: payload.stateKey,
					value: {
						loading: false,
						loaded: true
					}
				})
				return {
					props: state,
					preProp: state[payload.stateKey] || '',
					prop: ''
				}
			} 
			console.warn('data-:', data)
			// 处理数据
			const handleData = api[payload.apiKey || payload.stateKey].handler && api[payload.apiKey || payload.stateKey].handler({
				props: state,
				prop: state[payload.stateKey] || '',
				resData: data
			}) || data
			
			
			// 处理响应数据
			const resData = {
				props: state,
				preProp: state[payload.stateKey] || '',
				prop: handleData
			}
			
			// 保存数据
			isLoadStart ? commit('saveOrUpdate', {
				key: payload.stateKey,
				value: {
					loading: false,
					loaded: true,
					...handleData
				}
			}) : commit('saveOrUpdate', {
				key: payload.stateKey,
				value: handleData
			})
			console.warn("resData", resData)
			// 返回后台返回的数据
			return resData
		}
	}
})

export default store