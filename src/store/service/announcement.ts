import { Announcement } from 'src/types/Announcement';

export interface AnnouncementType {
  announcements: Announcement[];
  updateCounter: number;
}

export const AnnouncementStore = {
  state: () => ({
    announcements: [],
    updateCounter: 0
  }),
  mutations: {
    setAnnouncements(state: AnnouncementType, value: Announcement[]) {
      if (state.announcements.length != value.length)
        state.updateCounter = Math.abs(
          value.length - state.announcements.length
        );
      state.announcements = value;
    },
    clearAnnouncements(state: AnnouncementType) {
      state.announcements = [];
    },
    clearAnnouncementsUpdateCounter(state: AnnouncementType) {
      state.updateCounter = 0;
    }
  }
};
