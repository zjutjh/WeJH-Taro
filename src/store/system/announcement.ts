export const AnnouncementStore = {
	state: () => ({
		announcements: [],
		updateTime: {
			announcements: undefined
		}
	}),
	mutations: {
		setAnnouncements(state: any, value: number) {
			state.announcements = value;
			state.updateTime.announcements = new Date();
		},
		clearAnnouncements(state: any) {
			state.announcements = [];
		}
	}
};
