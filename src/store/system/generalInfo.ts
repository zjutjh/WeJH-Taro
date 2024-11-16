import useMemorizedRequest from "@/hooks/useMemorizedRequest";
import { SystemService } from "@/services";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";

function useGeneralInfo() {
  const { data } = useMemorizedRequest(
    "system/generalInfo",
    SystemService.getGeneralInfo, {
      initialData: {
        // @ts-expect-error 代码中未使用
        defaultTheme: undefined,
        fileUrl: "",
        "is_begin": true,
        jpgUrl: "",
        registerTips: "",
        schoolBusUrl: "",
        scoreTerm: "上",
        scoreYear: "2024",
        term: "上",
        termStartDate: "2024-09-15",
        termYear: "2024",
        time: "",
        week: 1
      },
      onError: (e) => {
        if (e instanceof RequestError)
          Taro.showToast({ title: `获取系统信息失败: ${e.message}`, icon: "error" });
      }
    }
  );

  return data;
}

export default useGeneralInfo;
