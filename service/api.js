import {
	loadArticlePages
} from '../states/constants.js'

/**
 * 定义数据接口层、数据处理
 */
module.exports = {
	[loadArticlePages.key]: {
		url: 'blog/list',
		handler: ({props, prop, resData}) => {
			console.warn('props:', props)
			console.warn('prop:', prop)
			console.warn('resData:', resData)
			return resData
		}
	}
}