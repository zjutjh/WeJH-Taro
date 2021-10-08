declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.scss';

declare const process: {
	env: {
		TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
		[key: string]: any;
	}
}
declare var wx: any
declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

import type Dayjs from 'dayjs';
declare module 'dayjs' {
	interface Dayjs {
		utc(): Dayjs;
		fromNow(): Dayjs;
		toNow(): Dayjs;
	}
}
