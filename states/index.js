// 定义vueX的基本数据格式类型
import { apiKey } from '../utils/constants.js'

const initStates = {}
Object.values(apiKey).forEach(item => {
	initStates[item] =  {}
});

console.warn(initStates, 'initStates')
const states = {
	...initStates,
}

export default states
