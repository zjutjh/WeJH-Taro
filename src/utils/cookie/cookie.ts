interface ICookie {
	Key: string;
	Value: string;
	Expires: Date;
	MaxAge: Number;
}
function ejectCookies(cookies: String[]) {
	let sevCookies: ICookie[] = [];
	cookies.forEach((cookie) => {
		let keyValves = cookie.split(';');
		let ckie: ICookie = { Key: '', Value: '', Expires: new Date(), MaxAge: 0 };
		if (keyValves.length > 0) {
			keyValves.forEach((item) => {
				let key: string, value: string;
				[key, value] = item.split('=');
				if (key === 'Expires') {
					ckie.Expires = new Date(value);
				} else if (key === 'Max-Age') {
					ckie.MaxAge = parseInt(value);
				} else if (ckie.Key === '') {
					ckie.Key = key;
					ckie.Value = value;
				}
			});
			sevCookies.push(ckie);
		}
	});
	return sevCookies;
}
function cookiesToString(cookies: ICookie[]) {
	let cookieString = '';
	cookies.forEach((cokie) => {
		cookieString += `${cokie.Key}=${cokie.Value};`;
	});
	return cookieString;
}

export { ICookie, ejectCookies, cookiesToString };
