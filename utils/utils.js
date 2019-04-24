// 校验load
const checkIsStartWithLoad = (str) => { // true: 字符串load开头
	return str && str.toLocaleLowerCase().startsWith('load') || false
}

export {
	checkIsStartWithLoad
}