export const CardServiceStore = {
	state: () => ({
		balance: 0,
		history: [],
		today: [],
		updateTime: {
			balance: undefined,
			history: undefined,
			today: undefined
		}
	}),
	mutations: {
		setCardBalance(state: any, value: number) {
			state.balance = value;
			state.updateTime.balance = new Date();
		},
		setCardHistory(state: any, value: Array<object>) {
			state.history = value;
			state.updateTime.history = new Date();
		},
		setCardToday(state: any, value: Array<object>) {
			state.today = value;
			state.updateTime.today = new Date();
		},
		clearCardToday(state: any) {
			state.today = [];
		}
	}
};
