import { useRequestNext } from "@/hooks";
import { SystemService } from "@/services";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

const useNotificationStore = defineStore("notification", () => {
  const unreadCountInStore = +persistedStorage.getItem("notification")?.unreadCount || 0;
  /** 公告+资讯的未阅读数量 */
  const unreadCount = ref(0);

  const { data: collection } = useRequestNext(
    () => Promise.all([
      SystemService.getAnnouncement(),
      SystemService.getInformation()
    ]), {
      initialData: [[], []],
      onSuccess: (response) => {
        unreadCount.value =
          (response[0].length + response[1].length) - unreadCountInStore;
      }
    }
  );
  const announcement = computed(() => collection.value[0]);
  const information = computed(() => collection.value[1]);

  watch([announcement, information], () => {
    // TODO: 从持久化数据中读取，并对比
  });

  return {
    announcement, // 精弘公告
    information, // 校园资讯
    unreadCount
  };
}, {
  persist: {
    storage: persistedStorage
  }
});

export default useNotificationStore;
