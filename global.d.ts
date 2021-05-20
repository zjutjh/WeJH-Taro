declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.scss';
declare namespace NodeJS {
	interface ProcessEnv {
		TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
	}
}

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
