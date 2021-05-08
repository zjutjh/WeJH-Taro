export const RuntimeStore = {
	state: () => ({
		process: {
			env: process.env.TARO_ENV
		}
	})
};
