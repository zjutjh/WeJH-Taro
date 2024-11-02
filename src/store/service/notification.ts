import { useRequestNext } from "@/hooks";
import { SystemService } from "@/services";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useNotificationStore = defineStore("notification", () => {
  /** 公告+资讯的未阅读数量 */
  const announcementReadIds = ref<number[]>([]);
  const informationReadIds = ref<number[]>([]);

  const { data: collection } = useRequestNext(
    () => Promise.all([
      SystemService.getAnnouncement(),
      SystemService.getInformation()
    ]), {
      initialData: [[], []]
    }
  );

  const announcement = computed(() => collection.value[0]);
  const information = computed(() => collection.value[1]);

  const unreadCount = computed(() => {
    const announcementReadSet = new Set(announcementReadIds.value);
    const informationReadSet = new Set(informationReadIds.value);

    const announcementDiff = announcement.value.map(({ id }) => id).filter(id => !announcementReadSet.has(id));
    const informationDiff = information.value.map(({ id }) => id).filter(id => !informationReadSet.has(id));

    return announcementDiff.length + informationDiff.length;
  });

  function markRead() {
    announcementReadIds.value = announcement.value.map(({ id }) => id);
    informationReadIds.value = information.value.map(({ id }) => id);
  }

  return {
    announcement, // 精弘公告
    information, // 校园资讯
    collection,
    announcementReadIds,
    informationReadIds,
    unreadCount,
    markRead
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["collection", "announcementReadIds", "informationReadIds"]
  }
});

export default useNotificationStore;
