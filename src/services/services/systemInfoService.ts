function getSystemInfo() {
	if (process.env.TARO_ENV === 'weapp') {
		return Taro.getSystemInfoSync();
	} else if (process.env.TARO_ENV === 'h5') {
	}
}

async function getSystemInfoAsync() {
	return new Promise((resolve, reject) => {
		if (process.env.TARO_ENV === 'weapp') {
			resolve(Taro.getSystemInfo());
		} else if (process.env.TARO_ENV === 'h5') {
		} else {
			reject();
		}
	});
}
