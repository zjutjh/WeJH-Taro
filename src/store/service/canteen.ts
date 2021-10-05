export const CanteenServiceStore = {
	state: () => ({
		canteen: {
			flow: undefined,
			updateTime: {
				flow: undefined
			}
		}
	}),
	mutations: {
		setCanteenFlow(state: any, value) {
			state.canteen.flow = value;
			state.canteen.updateTime.flow = new Date();
		}
	}
};
