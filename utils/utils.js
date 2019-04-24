import store from '../store/index.js'

// 校验load
const checkIsStartWithLoad = (str) => { // true: 字符串load开头
	return str && str.toLocaleLowerCase().startsWith('load') || false
}

// 发起异步请求
const asyncReq = (vue, payload) => store.dispatch({
		type: 'asyncReqData',
		payload,
	})
	

export {
	checkIsStartWithLoad,
	asyncReq,
}