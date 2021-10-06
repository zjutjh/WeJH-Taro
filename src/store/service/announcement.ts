import { Announcement } from "@/types/Announcement";
export interface AnnouncementType {
	announcements: Announcement[],
	updateTime: {
		announcements?: Date
	}
}

export const AnnouncementStore = {
	state: () => ({
		announcements: [],
		updateTime: {
			announcements: undefined
		}
	}),
	mutations: {
		setAnnouncements(state: AnnouncementType, value: Announcement[]) {
			state.announcements = value;
			state.updateTime.announcements = new Date();
		},
		clearAnnouncements(state: AnnouncementType) {
			state.announcements = [];
		}
	}
};
