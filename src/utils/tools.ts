function throttle(fn, delay = 1000): Function {
	let timer: any = null;
	return function() {
		let res = undefined;
		if (timer) return res;
		timer = setTimeout(() => {
			res = fn.apply(this, arguments);
			timer = null;
		}, delay);
	};
}
function throttle2(fn, delay = 1000): Function {
	let p: Promise<any> | null = null;
	return async function() {
		if (!p) {
			p = new Promise((resolve) => {
				resolve(fn.apply(this, arguments));
			});
			let res = await p;
			p = null;
			return res;
		} else {
			return await p;
		}
	};
}
function groupBy(array: Array<any>, f: Function) {
	let groups = {};
	array?.forEach(function(o) {
		let group = JSON.stringify(f(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	return Object.keys(groups).map(function(group) {
		return groups[group];
	});
}

export { throttle, throttle2, groupBy };
