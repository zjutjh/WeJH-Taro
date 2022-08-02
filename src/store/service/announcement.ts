import { Announcement } from 'src/types/Announcement';

export interface AnnouncementType {
  announcements: Announcement[];
  updateTime: {
    announcements?: Date;
  };
}

export const AnnouncementStore = {
  state: () => ({
    announcements: []
  }),
  mutations: {
    setAnnouncements(state: AnnouncementType, value: Announcement[]) {
      state.announcements = value;
    },
    clearAnnouncements(state: AnnouncementType) {
      state.announcements = [];
    }
  }
};
