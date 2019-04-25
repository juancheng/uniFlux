/**
 * 定义数据接口层、数据处理
 */
const loadArticlePages = {
	url: 'blog/list',
	handler: ({
		props,
		prop,
		resData
	}) => {
		console.warn('api, props:', props)
		console.warn('prop:', prop)
		console.warn('resData:', resData)
		return resData
	}
}

export {
	loadArticlePages
}
