export interface IUser {
	info: {
		username: string;
		studentID: string;
	};
	isActive: boolean;
	isBindZF: boolean;
	isBindCard: boolean;
	isBindLibrary: boolean;
}
export const UserServiceStore = {
	state: () => ({
		info: {},
		isActive: false,
		isBindZF: false,
		isBindCard: false,
		isBindLibrary: false
	}),
	mutations: {
		setBindZF(state: any, value: boolean) {
			console.log(value);
			state.isBindZF = value;
		},
		setBindSchoolCard(state: any, value: boolean) {
			state.isBindCard = value;
		},
		setBindLibrary(state: any, value: boolean) {
			state.isBindLibrary = value;
		},
		setUserInfo(state: any, value: any) {
			state.info = value;

			state.isBindZF = value.bind.zf;
			state.isBindCard = value.bind.card;
			state.isBindLibrary = value.bind.lib;
			state.isActive = true;
		},
		clearUserInfo(state: any) {
			state.info = {};
			state.isActive = false;
		}
	}
};
