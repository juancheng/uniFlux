if (process.env.NODE_ENV === 'production') {
	module.exports = {
		serverUrl: 'http://192.168.0.235:8081/',
		wxServerUrl: 'http://wx.51zouchuqu.com/wechat/',
		scServerUrl: 'http://sensor.51zouchuqu.com:8106/sa?project=default',
	};
} else {
	module.exports = {
		serverUrl: 'http://192.168.0.235:8081/',
		wxServerUrl: 'http://wx.51zouchuqu.com/wechat/',
		scServerUrl: 'http://sensor.51zouchuqu.com:8106/sa?project=default',
	};
}
