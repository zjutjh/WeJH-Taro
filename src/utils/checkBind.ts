import { serviceStore } from "@/store";
import { computed } from "vue";

export const checkBind = {
  isBindZF: computed(() => serviceStore.user.isBindZF),
  isBindYXY: computed(() => serviceStore.user.isBindYXY),
  isBindLibrary: computed(() => serviceStore.user.isBindLibrary),
};
