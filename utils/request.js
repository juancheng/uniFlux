import config from './config.js'
import {
	storageKey
} from './constants.js'
const {
	serverUrl
} = config;

// 处理错误码
const errorMessages = (res) => `${res.statusCode}`;

// 校验302 重定向状态
function check302(res) {
	console.warn("check302:", res)
	if (res.statusCode == 302) {
		return Promise.reject(errorMessages(res));
	}
	return res;
}

// 校验404 
function check404(res) {
	console.warn("check404:", res)
	if (res.statusCode === 404) {
		return Promise.reject(errorMessages(res));
	}
	return res;
}

// 校验正常状态
function checkStatus(response) {
	console.warn("checkStatus:", response)
	if (response.statusCode >= 200 && response.statusCode < 300) {
		return response;
	} else {
		return response;
	}
}

function setUriParam(keys, value, keyPostfix) {
  let keyStr = keys[0];

  keys.slice(1).forEach((key) => {
    keyStr += `[${key}]`;
  });

  if (keyPostfix) {
    keyStr += keyPostfix;
  }

  return `${encodeURIComponent(keyStr)}=${encodeURIComponent(value)}`;
}

function getUriParam(keys, object) {
  const array = [];

  if (object instanceof (Array)) {
    object.forEach((value) => {
      array.push(setUriParam(keys, value, '[]'));
    });
  } else if (object instanceof (Object)) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        array.push(getUriParam(keys.concat(key), value));
      }
    }
  } else {
    if (object !== undefined) {
      array.push(setUriParam(keys, object));
    }
  }

  return array.join('&');
}

// 解析字符串
function toQueryString(object) {
	const array = [];

	for (const key in object) {
		if (object.hasOwnProperty(key)) {
			const str = getUriParam([key], object[key]);
			if (str !== '') {
				array.push(str);
			}
		}
	}

	return array.join('&');
}

// 解析返回的数据
function jsonParse(res) {
	console.warn('jsonParse:', res)
	const data = res && res.data || {}
	if (data && data.code === 200) {
		return data.data
	}
	// data.message
}

// 统一处理请求异常
function httpErr(e) {
	console.error('http error: ', e)
}

// 请求方法
export function request(options) {
	let url = options && options.url || ''
	let mergeUrl = url
	if (!url.startsWith('http')) {
		if (url.startsWith("/")) {
			url = url.substring(1)
		}
		mergeUrl = serverUrl.concat(url)
	}
	const defaultOptions = {
		method: 'GET'
	};
	const opts = Object.assign({}, defaultOptions, { ...options
	})
	// add query params to url when method is GET
	if (opts && opts.method == "GET" && opts['params']) {
		mergeUrl = mergeUrl + '?' + toQueryString(opts['params'])
	}
	opts.url = mergeUrl
	opts.header = {
		...opts.headers,
		"x-auth-token": uni.getStorageSync(storageKey.token),
		"p": '8'
	};

	return new Promise((resolve, reject) => uni.request({
			...opts,
			success: (data) => {
				resolve(data)
			},
			fail: () => { // 网络无法链接、403
				reject('请求异常...')
			}
		}))
		.then(check302)
		.then(check404)
		.then(checkStatus)
		.then(jsonParse)
		.catch(httpErr)

}

// 延迟执行
export function delay() {
	return new Promise((resolve, reject) => setTimeout(() => {
		resolve({
			code: 200,
			data: {},
			message: '请求异常'
		})
	}, 10000))
}
