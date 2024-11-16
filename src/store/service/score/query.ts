import { RequestError } from "@/utils";
import { ZFService } from "@/services";
import { omit } from "lodash-es";
import Taro from "@tarojs/taro";
import { withRespDataNeverNull, withRetry } from "@/utils/promise";
import useMemorizedRequest from "@/hooks/useMemorizedRequest";

function scoreFetcher(params: { year: string, term: "上" | "下" | "短", period: "期中" | "期末" }) {
  if (params.period === "期中")
    return ZFService.getMidTermScore(omit(params, "period"));
  return ZFService.getFinalTermScore(omit(params, "period"));
}

function useScoreQuery(options: {
  defaultQueryParams: {
    year: string;
    term: string;
    period: "期中" | "期末"
  }
}) {
  const { loading, data, mutate: fetchScore } = useMemorizedRequest(
    (params) => `score/collection/${params?.year}/${params?.term}/${params?.period}`,
    withRetry(withRespDataNeverNull(scoreFetcher)), {
      defaultParams: options.defaultQueryParams,
      initialData: [],
      onError: (e) => {
        if (e instanceof RequestError) {
          Taro.showToast({ title: `更新成绩失败: ${e.message}`, icon: "none" });
        }
      }
    }
  );

  return {
    loading,
    fetchScore,
    list: data
  };
}

export default useScoreQuery;
