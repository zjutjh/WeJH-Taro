export interface CardServiceType {
	balance?: number;
	today: any;
	history: any;
	updateTime: {
		today?: string;
		history?: string;
		balance?: string;
	};
}
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
		setCardHistory(state: any, value: { month: string; year: string; data: [] }) {
			if (!state[value.year]) state[value.year] = {};
			state[value.year][value.month] = {
				data: value.data,
				updateTime: new Date()
			};
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
