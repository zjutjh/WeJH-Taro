import { ZFService } from "@/services";
import { omit } from "lodash-es";
import { useQuery } from "@tanstack/vue-query";
import { Ref, watchEffect } from "vue";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";

/**
 * 将查询期中和期末成绩这两个不同的接口，合并到一个函数中
 */
function scoreFetcher(params: { year: string, term: "上" | "下" | "短", period: "期中" | "期末" }) {
  if (params.period === "期中")
    return ZFService.getMidTermScore(omit(params, "period"));
  return ZFService.getFinalTermScore(omit(params, "period"));
}

function useScoreQuery(options: {
  year: Ref<string> | string;
  term: Ref<"上" | "下" | "短"> | "上" | "下" | "短";
  period: Ref<"期中" | "期末"> | "期中" | "期末";
}) {

  const { isFetching, data, refetch, error } = useQuery({
    queryKey: ["score", options.year, options.term, options.period] as const,
    queryFn: ({ queryKey }) => scoreFetcher({
      year: queryKey[1],
      term: queryKey[2],
      period: queryKey[3]
    }),
    placeholderData: []
  });

  watchEffect(() => {
    if (error.value !== null && error.value instanceof RequestError) {
      Taro.showToast({ title: `更新成绩失败: ${error.value.message}`, icon: "none" });
    }
  });

  return {
    loading: isFetching,
    refetch,
    list: data
  };
}

export default useScoreQuery;
