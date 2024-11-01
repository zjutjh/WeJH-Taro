import { useRequestNext } from "@/hooks";
import { ZFService } from "@/services";
import { MPErrorCode, persistedStorage, RequestError } from "@/utils";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";

async function freeRoomFetcher(params: {
  year: string;
  term: string;
  campus: string;
  weekday: number;
  sections: number;
  week: number;
}) {
  Taro.showLoading({ title: "加载中" });
  const res = await ZFService.getFreeRoomInfo({
    year: params.year,
    term: params.term,
    campus: params.campus,
    week: Math.pow(2, params.week).toString(),
    weekday: (params.weekday + 1).toString(),
    sections: Math.pow(2, params.sections).toString()
  });
  Taro.hideLoading();
  if (!Array.isArray(res)) {
    const e = new RequestError("数据异常", MPErrorCode.MP_INVALID_DATA_VALUE);
    console.error(e);
    throw e;
  }
  return res;
}

const useFreeRoomStore = defineStore("freeRoom", () => {
  const { loading, data: list, run: fetchFreeRoom, error } = useRequestNext(
    freeRoomFetcher, {
      manual: true,
      initialData: [],
      onError: (e) => {
        if (e instanceof RequestError)
          Taro.showToast({ title: `查询空教室失败: ${e.message}`, icon: "none" });
      }
    }
  );

  return {
    list,
    fetchFreeRoom,
    loading,
    error
  };
}, {
  persist: {
    storage: persistedStorage,
    pick: ["list"]
  }
});

export default useFreeRoomStore;
