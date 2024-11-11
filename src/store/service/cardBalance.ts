import { useRequestNext } from "@/hooks";
import { YxyService } from "@/services";
import { MPErrorCode, persistedStorage, RequestError } from "@/utils";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";
import { ref } from "vue";

const useCardBalanceStore = defineStore("cardBalance", () => {
  const updateTime = ref<string>();

  const { data: balance, error } = useRequestNext(
    () => YxyService.querySchoolCardBalance().then(value => {
      if (!Number.isFinite(+value)) throw new RequestError("无效余额值", MPErrorCode.MP_INVALID_DATA_VALUE);
      return +value;
    }), {
      initialData: 0,
      onSuccess: () => {
        updateTime.value = Date().toString();
      },
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `查询校园卡余额失败: ${e.message}`, icon: "none" });
        }
      }
    }
  );

  return {
    balance,
    error,
    updateTime
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["balance", "updateTime"]
  }
});

export default useCardBalanceStore;
