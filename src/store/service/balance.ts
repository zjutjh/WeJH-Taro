import { useRequestNext } from "@/hooks";
import { YxyService } from "@/services";
import { persistedStorage, RequestError } from "@/utils";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";
import { ref } from "vue";

const useElectricityBalanceStore = defineStore("electricity", () => {
  const room = ref({ name: "", code: "" });
  const balance = ref(0);
  const updateTime = ref<string>();

  const { loading, error } = useRequestNext(
    YxyService.queryBalance, {
      initialData: {
        "display_room_name": "",
        "md_name": "",
        "room_code": "",
        "soc": 0,
        "soc_amount": 0
      },
      onSuccess: (res) => {
        room.value.name = res.display_room_name;
        room.value.code = res.room_code;
        balance.value = res.soc;
        updateTime.value = Date().toString();
      },
      onError: (e) => {
        if (e instanceof RequestError)
          Taro.showToast({ title: `查询余额失败: ${e.message}`, icon: "none" });
      }
    }
  );

  return {
    loading,
    error,
    room,
    balance,
    updateTime
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["room", "updateTime", "balance"]
  }
});

export default useElectricityBalanceStore;
