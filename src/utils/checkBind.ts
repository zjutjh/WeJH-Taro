import { serviceStore } from "@/store";
import { computed } from "vue";

export const checkBind = {
  //之后需要改动，目前zf和oauth的功能是等效的，因此zf和oauth有一个为true即可使用
  //原来的代码是 isBindZF: computed(() => (serviceStore.user.isBindZF),
  isBindZF: computed(() => (serviceStore.user.isBindZF || serviceStore.user.isBindOauth)),
  isBindYXY: computed(() => serviceStore.user.isBindYXY),
  isBindLibrary: computed(() => serviceStore.user.isBindLibrary),
};
