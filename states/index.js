// 定义vueX的基本数据格式类型
import { apiKey } from '../utils/constants.js'

const initStates = {}
Object.values(apiKey).forEach(item => {
	initStates[item] =  {}
});

for(let i = 0; i < 2000; i++) {
	initStates['kk'+ i] = {}
}

console.warn(initStates, 'initStates')
const states = {
	...initStates,
}

export default states
