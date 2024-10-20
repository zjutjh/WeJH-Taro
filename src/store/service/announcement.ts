import { Announcement } from "src/types/Announcement";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface AnnouncementType {
  announcements: Announcement[];
  updateCounter: number;
}

export const useAnnouncementStore = defineStore("announcement", () => {
  const announcements = ref<Announcement[]>();
  const updateCounter = ref(0);

  const setAnnouncements = (value: Announcement[]) => {
    if (announcements.value?.length != value.length)
      updateCounter.value = Math.abs(
        value.length - announcements.value!.length
      );
    announcements.value = value;
  };
  const clearAnnouncements = () => {
    announcements.value = [];
  };
  const clearAnnouncementsUpdateCounter = () => {
    updateCounter.value = 0;
  };
  return {
    announcements,
    updateCounter,
    setAnnouncements,
    clearAnnouncements,
    clearAnnouncementsUpdateCounter
  };
});

