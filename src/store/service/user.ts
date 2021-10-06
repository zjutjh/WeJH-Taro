export interface UserType {
	info?: {
		studentID: string;
	};
	isActive: boolean;
	isBindZF: boolean;
	isBindCard: boolean;
	isBindLibrary: boolean;
}
export const UserServiceStore = {
	state: () => ({
		info: undefined,
		isActive: false,
		isBindZF: false,
		isBindCard: false,
		isBindLibrary: false
	}),
	mutations: {
		setBindZF(state: UserType, value: boolean) {
			state.isBindZF = value;
		},
		setBindSchoolCard(state: UserType, value: boolean) {
			state.isBindCard = value;
		},
		setBindLibrary(state: UserType, value: boolean) {
			state.isBindLibrary = value;
		},
		setUserInfo(state: UserType, value: { studentID: string, bind: { zf: boolean, card: boolean, lib: boolean } }) {
			state.info = value;
			state.isBindZF = value.bind.zf;
			state.isBindCard = value.bind.card;
			state.isBindLibrary = value.bind.lib;
			state.isActive = true;
		},
		clearUserInfo(state: UserType) {
			state.info = undefined;
			state.isActive = false;
		}
	}
};
