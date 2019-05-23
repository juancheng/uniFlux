// 定义vueX的基本数据格式类型
import * as api from '../service/index.js'

const initStates = {}
Object.keys(api).forEach(item => {
	initStates[item] =  {}
});

console.warn(initStates)
const states = {
	...initStates,
}

export default states
