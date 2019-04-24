import Vue from 'vue'
import Vuex from 'vuex'
import { request, delay } from '../utils/request.js'
import api from '../service/api.js'
import states from '../states/constants.js'
import { checkIsStartWithLoad } from '../utils/utils.js'

Vue.use(Vuex)

// 初始化数据
const state = {}
Object.keys(states).forEach(item => {
	state[states[item].key] = states[item].value
})

const store = new Vuex.Store({
    state,
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
				url: api[payload.stateKey].url,
				method: payload.method || api[payload.method] || 'GET',
				headers: payload.headers || api[payload.headers] || '',
				params: payload.params || api[payload.params] || ''
			});
			if(!data) {
				isLoadStart && commit('saveOrUpdate', {
					key: payload.stateKey,
					value: {
						loading: false,
						loaded: true
					}
				})
				return
			} // 请求数据异常
			// 处理数据
			const handleData = api[payload.stateKey].handler && api[payload.stateKey].handler({
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


