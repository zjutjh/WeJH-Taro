export const CanteenServiceStore = {
	state: () => ({
		flow: undefined,
		updateTime: {
			flow: undefined
		}
	}),
	mutations: {
		setCanteenFlow(state: any, value) {
			state.flow = value;
			state.updateTime.flow = new Date();
		}
	}
};
